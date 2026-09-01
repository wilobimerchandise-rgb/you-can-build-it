# YouCanBuildIt v1.1 — StackBlitz/Vercel Starter

Real, runnable TypeScript foundation implementing the v1.1 spec. Read this
before wiring it to production — it tells you exactly what's load-bearing
and what still needs building.

## Fixes applied from the CTO/PM/COPPA review (see chat for full writeup)

1. **Kid auth is not Supabase Auth.** Kids sign in via PIN (`api/auth/kid-login.ts`),
   which issues a signed, short-lived token (`src/lib/kidSession.ts`) scoped to one
   `kid_id`. Every kid-facing `/api` route verifies this token before touching the
   database with the service-role key. RLS in `supabase/schema.sql` protects the
   *parent-facing* surface (Parent HQ, dashboard reads via the parent's own
   session) — it is a second layer for kid data, not the only one, because a kid
   is not an `auth.uid()` principal.
2. **Rate limiting is Postgres-backed** (`src/lib/rateLimit.ts`, `publish_rate_limit`
   table), not in-memory — Vercel functions are stateless, so an in-memory counter
   would silently reset on every cold start.
3. **"Git for Kids" is a lightweight append-only `code_versions` table**, not real
   git. Diffing two JSON snapshots client-side gets you the pedagogical value
   (kids see what changed) without the actual complexity of a VCS.
4. **Billing is untouched by kid sessions.** No file that verifies a kid-session
   token also touches Stripe/Paystack — that boundary is enforced by which
   endpoints exist, not just by a runtime check, to keep the blast radius of any
   future bug contained to non-payment surfaces.
5. **Random slugs are minted server-side only** (`api/publish.ts`), with a
   collision check against `projects.slug` before writing.

## What's real and working
- All 5 prompts from the playbook as typed modules in `src/lib/ai/*.ts`, each
  exporting the system prompt constant AND a typed async function
- `src/lib/ai/openaiClient.ts` — the shared, server-only OpenAI caller (JSON-mode
  enforcement + moderation helper)
- `/api/ai/plan.ts`, `/api/ai/codegen.ts`, `/api/ai/mentor.ts` — kid-session-gated
  routes wired to those modules
- `/api/publish.ts` — rate limit → moderation gate → slug mint → activity log,
  in that order
- `/api/cron/weekly-email.ts` — Vercel Cron job (see `vercel.json`) that assembles
  the 7-day summary and calls the email-generation prompt (transactional send
  itself is a `TODO` — no provider was specified in the spec)
- Full schema with RLS, seeded with the 5 MVP templates and the `first_app` badge
- Age-tier config (`src/lib/ageConfig.ts`) now includes `showGitDiff`,
  `requiresCommentsInCode`, and `ideLayout` flags per the v1.1 UI spec

## What's intentionally NOT built (flagged, not silently skipped)
- Monaco editor integration + the visual-blocks view for 10-12 (`splitScreen`)
- The actual Vercel Deploy API call in `publish.ts` (currently persists the
  publish record so the rest of the pipeline is testable, but doesn't push a
  real static build yet)
- Badge *engine* (the `badges`/`kid_badges` tables + seed exist; the rule
  evaluator that reads `activity_log` and awards them does not)
- Stripe/Paystack checkout flows — env vars are wired, endpoints are not
- IndexedDB/Dexie offline sync — see review: cut from v1.1 scope, revisit for v1.2
- Transactional email send in the cron job

## Running it
```bash
npm install
cp .env.example .env.local   # fill in Supabase + OpenAI + KID_SESSION_SECRET
npm run dev
```
Apply `supabase/schema.sql` in your Supabase SQL editor first. Deploy to Vercel;
the `api/` folder and `vercel.json` cron are auto-detected. `KID_SESSION_SECRET`
should be a long random string (e.g. `openssl rand -hex 32`) — treat it like a
password, it's what lets a token impersonate a kid session if leaked.
