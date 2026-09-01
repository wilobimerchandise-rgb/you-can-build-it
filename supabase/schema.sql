-- YouCanBuildIt v1.1 schema
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ── PARENTS (account holder of record; the ONLY Supabase Auth principal) ──
create table parents (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) not null unique,
  email text unique not null,
  plan text not null default 'free' check (plan in ('free','family','school')),
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ── KIDS ──────────────────────────────────────────────────────────────
-- Kids are NOT auth.users rows (COPPA data-minimization + review note:
-- see kidSession.ts for how kid-scoped API requests are authenticated
-- instead of relying on auth.uid()).
create table kids (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references parents(id) on delete cascade not null,
  nickname text not null,
  birth_year int not null,
  age_track text not null check (age_track in ('8-10','10-12','12-14','14-16')),
  pin_hash text not null,
  created_at timestamptz not null default now()
);

-- ── TEMPLATES ─────────────────────────────────────────────────────────
create table templates (
  id text primary key,
  title text not null,
  age_tracks text[] not null,
  problem text not null,
  starter_prompt text not null,
  data_model jsonb not null default '[]'
);

-- ── PROJECTS ──────────────────────────────────────────────────────────
create table projects (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid references kids(id) on delete cascade not null,
  template_id text references templates(id),
  title text not null,
  slug text unique,
  status text not null default 'draft'
    check (status in ('draft','building','published','held_for_review','blocked')),
  code_json jsonb, -- [{path, language, content}]
  publish_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── CODE VERSIONS ─────────────────────────────────────────────────────
-- Lightweight append-only snapshot history, NOT real git. Powers the
-- "Git for Kids" diff view (12-14+) by diffing against the previous
-- snapshot client-side — see review note on why full git is out of scope.
create table code_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  code_json jsonb not null,
  created_at timestamptz not null default now()
);

-- ── BADGES ────────────────────────────────────────────────────────────
create table badges (
  id text primary key,
  name text not null,
  rule_json jsonb not null -- e.g. {"event":"published","count":1}
);

create table kid_badges (
  kid_id uuid references kids(id) on delete cascade not null,
  badge_id text references badges(id) not null,
  earned_at timestamptz not null default now(),
  primary key (kid_id, badge_id)
);

-- ── ACTIVITY LOG ──────────────────────────────────────────────────────
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid references kids(id) on delete cascade not null,
  event text not null, -- project_created | plan_generated | mentor_opened | published | badge_earned
  meta jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ── MODERATION QUEUE (service-role only, no client policy) ────────────
create table moderation_queue (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  reasons text[] not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ── RATE LIMIT (backs src/lib/rateLimit.ts) ────────────────────────────
create table publish_rate_limit (
  kid_id uuid primary key references kids(id) on delete cascade,
  window_start timestamptz not null,
  count int not null default 0
);

-- ══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════════
-- Kids are not auth.users principals, so RLS below protects the PARENT-
-- facing surface (Parent HQ, dashboard reads via the parent's own
-- Supabase session). All KID-facing writes/reads go through /api routes
-- using the service-role key + the signed kid-session token — RLS is a
-- second layer there, not the only one. Do not expose the anon key with
-- broad kid-table access as a substitute for the token check.

alter table parents enable row level security;
alter table kids enable row level security;
alter table projects enable row level security;
alter table kid_badges enable row level security;
alter table activity_log enable row level security;
-- moderation_queue and publish_rate_limit: NO policy created =
-- inaccessible to anon/authenticated roles, service-role only.

create policy "parents_select_own" on parents for select using (auth_user_id = auth.uid());
create policy "parents_update_own" on parents for update using (auth_user_id = auth.uid());

create policy "kids_select_own" on kids for select using (
  parent_id in (select id from parents where auth_user_id = auth.uid())
);
create policy "kids_insert_own" on kids for insert with check (
  parent_id in (select id from parents where auth_user_id = auth.uid())
);
create policy "kids_update_own" on kids for update using (
  parent_id in (select id from parents where auth_user_id = auth.uid())
);
create policy "kids_delete_own" on kids for delete using (
  parent_id in (select id from parents where auth_user_id = auth.uid())
); -- backs the COPPA data-deletion endpoint (§6): parent-initiated cascade delete

create policy "projects_select_own" on projects for select using (
  kid_id in (select k.id from kids k join parents p on p.id = k.parent_id where p.auth_user_id = auth.uid())
);

create policy "kid_badges_select_own" on kid_badges for select using (
  kid_id in (select k.id from kids k join parents p on p.id = k.parent_id where p.auth_user_id = auth.uid())
);

create policy "activity_log_select_own" on activity_log for select using (
  kid_id in (select k.id from kids k join parents p on p.id = k.parent_id where p.auth_user_id = auth.uid())
);

-- Templates and badge catalog: public read, not personal data.
alter table templates enable row level security;
create policy "templates_public_read" on templates for select using (true);
alter table badges enable row level security;
create policy "badges_public_read" on badges for select using (true);

-- ══════════════════════════════════════════════════════════════════════
-- SEED: 5 templates for the Week 1-2 MVP scope
-- ══════════════════════════════════════════════════════════════════════
insert into templates (id, title, age_tracks, problem, starter_prompt, data_model) values
('chore-chart', 'Chore Star Chart', array['8-10'], 'remembering chores',
  'Build me a chart where I get a star for every chore I finish',
  '[{"table":"chores","fields":[{"name":"name","type":"text"},{"name":"done","type":"boolean"},{"name":"stars","type":"int"}]}]'),
('homework-tracker', 'Homework Tracker', array['10-12'], 'missed homework',
  'Build me a homework tracker with due dates and subjects',
  '[{"table":"assignments","fields":[{"name":"subject","type":"text"},{"name":"due_date","type":"date"},{"name":"done","type":"boolean"}]}]'),
('budget-split', 'Personal Budget Split', array['12-14'], 'managing multiple money sources',
  'Build me a budget app that splits money into save/spend/give buckets',
  '[{"table":"income","fields":[{"name":"source","type":"text"},{"name":"amount","type":"numeric"}]},{"table":"buckets","fields":[{"name":"name","type":"text"},{"name":"percent","type":"numeric"}]}]'),
('pomodoro-analytics', 'Study Pomodoro + Analytics', array['12-14'], 'unfocused studying',
  'Build me a Pomodoro timer that tracks which subject I studied and for how long',
  '[{"table":"sessions","fields":[{"name":"subject","type":"text"},{"name":"duration","type":"int"},{"name":"date","type":"date"}]}]'),
('application-tracker', 'Application Tracker', array['14-16'], 'disorganized applications',
  'Build me a Kanban tracker for internship applications with stages: applied, interview, offer',
  '[{"table":"applications","fields":[{"name":"company","type":"text"},{"name":"role","type":"text"},{"name":"stage","type":"text"},{"name":"notes","type":"text"}]}]')
on conflict (id) do nothing;

insert into badges (id, name, rule_json) values
('first_app', 'First App', '{"event":"published","count":1}')
on conflict (id) do nothing;
