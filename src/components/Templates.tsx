import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { LayoutGrid, Star, Clock, BookOpen, PiggyBank, Palette, ClipboardList, Users2, Monitor, ChefHat, Search, Bug, CalendarClock, Timer, Wallet, Flame, Trophy, HeartHandshake, Briefcase, CalendarRange, TrendingUp, Database, X, ChevronRight, type LucideIcon } from 'lucide-react';

type TrackId = 'builders' | 'makers' | 'coders' | 'engineers';

interface Template {
  title: string;
  hook: string;
  problem: string;
  prompt: string;
  dataModel: string;
  icon: LucideIcon;
  tracks: TrackId[];
  stretch: string;
}

const TEMPLATES: Template[] = [
  // 8-10 Builders
  {
    title: 'Chore Star Chart',
    hook: 'Turn chores into a game.',
    problem: 'Remembering chores',
    prompt: 'Build me a chart where I get a star for every chore I finish.',
    dataModel: 'chores(id, name, done, stars)',
    icon: Star,
    tracks: ['builders'],
    stretch: 'Weekly star total with a celebration animation',
  },
  {
    title: 'Pet Feeding Reminder',
    hook: 'Never forget to feed your pet.',
    problem: 'Forgetting pet care',
    prompt: 'Build me a reminder for feeding my hamster twice a day.',
    dataModel: 'pets(id, name, feed_times[]), feed_log',
    icon: Clock,
    tracks: ['builders'],
    stretch: 'Streak counter',
  },
  {
    title: 'Reading Log Buddy',
    hook: 'Track every book like a trophy.',
    problem: 'Staying motivated to read',
    prompt: 'Build me a place to log books I\'ve read with a sticker for each one.',
    dataModel: 'books(id, title, finished_date, sticker)',
    icon: BookOpen,
    tracks: ['builders'],
    stretch: 'Pages-per-day bar chart',
  },
  {
    title: 'Allowance Piggy Bank Tracker',
    hook: 'Watch your savings grow.',
    problem: 'Understanding saving',
    prompt: 'Build me a piggy bank that shows how much money I\'ve saved.',
    dataModel: 'transactions(id, amount, note, date)',
    icon: PiggyBank,
    tracks: ['builders'],
    stretch: 'Goal progress bar (e.g., saving for a toy)',
  },
  {
    title: 'My Daily Mood Map',
    hook: 'Color your day.',
    problem: 'Emotional check-ins',
    prompt: 'Build me a calendar where I pick a color for how I feel each day.',
    dataModel: 'moods(date, color, note)',
    icon: Palette,
    tracks: ['builders'],
    stretch: 'Month-view color grid',
  },
  // 10-12 Makers
  {
    title: 'Homework Tracker',
    hook: 'Never lose an assignment again.',
    problem: 'Missed homework',
    prompt: 'Build me a homework tracker with due dates and subjects.',
    dataModel: 'assignments(id, subject, due_date, done)',
    icon: ClipboardList,
    tracks: ['makers'],
    stretch: 'Overdue-item red flag logic',
  },
  {
    title: 'Class Project Task Splitter',
    hook: 'Divide group work fairly.',
    problem: 'Unfair group projects',
    prompt: 'Build me a tool that splits a project into tasks for each teammate.',
    dataModel: 'tasks(id, project_id, assignee, status)',
    icon: Users2,
    tracks: ['makers'],
    stretch: 'Progress bar per teammate',
  },
  {
    title: 'Weekly Screen-Time Budget',
    hook: 'Set your own healthy limits.',
    problem: 'Self-managing screen time',
    prompt: 'Build me an app where I set a weekly game-time budget and log how much I\'ve used.',
    dataModel: 'budget(minutes_total), usage_log(date, minutes)',
    icon: Monitor,
    tracks: ['makers'],
    stretch: 'Warning banner near limit',
  },
  {
    title: 'Recipe Scaler for Family Dinner',
    hook: 'Cook for any size crowd.',
    problem: 'Doubling recipes',
    prompt: 'Build me an app that scales a recipe\'s ingredients up or down.',
    dataModel: 'recipes(id, ingredients[], base_servings)',
    icon: ChefHat,
    tracks: ['makers'],
    stretch: 'Unit conversion (cups to grams)',
  },
  {
    title: 'Lost & Found Class Board',
    hook: 'Find your stuff faster.',
    problem: 'Lost classroom items',
    prompt: 'Build me a board where my class can list lost items.',
    dataModel: 'items(id, description, location_found, claimed)',
    icon: Search,
    tracks: ['makers'],
    stretch: 'Claim flow with parent-moderated contact',
  },
  {
    title: 'Bug/Feature Idea Tracker',
    hook: 'Track your Minecraft mod ideas.',
    problem: 'Forgetting mod ideas',
    prompt: 'Build me a tracker for bugs and ideas in my Minecraft mod.',
    dataModel: 'ideas(id, type, title, status)',
    icon: Bug,
    tracks: ['makers'],
    stretch: 'Kanban-style status columns',
  },
  {
    title: 'Family Event Countdown Wall',
    hook: 'Countdown to what matters.',
    problem: 'Tracking multiple family events',
    prompt: 'Build me a wall of countdowns to birthdays and trips.',
    dataModel: 'events(id, name, date)',
    icon: CalendarClock,
    tracks: ['makers'],
    stretch: 'Auto-sorted by soonest',
  },
  // 12-14 Coders
  {
    title: 'Study Session Pomodoro + Analytics',
    hook: 'See where your focus actually goes.',
    problem: 'Unfocused studying',
    prompt: 'Build me a Pomodoro timer that tracks which subject I studied and for how long.',
    dataModel: 'sessions(id, subject, duration, date)',
    icon: Timer,
    tracks: ['coders'],
    stretch: 'Weekly bar chart by subject via a charting library',
  },
  {
    title: 'Personal Budget Split',
    hook: 'Budget like a real adult.',
    problem: 'Managing multiple money sources',
    prompt: 'Build me a budget app that splits money into save/spend/give buckets.',
    dataModel: 'income(id, source, amount), buckets(name, percent)',
    icon: Wallet,
    tracks: ['coders'],
    stretch: 'Editable percent sliders with live recalculation',
  },
  {
    title: 'Habit Streak Dashboard',
    hook: 'Build habits that actually stick.',
    problem: 'Inconsistent habits',
    prompt: 'Build me a dashboard tracking streaks for 3 habits I choose.',
    dataModel: 'habits(id, name), checkins(habit_id, date)',
    icon: Flame,
    tracks: ['coders'],
    stretch: 'Streak-freeze logic (1 miss allowed per week)',
  },
  {
    title: 'Team Roster & Stats Tracker',
    hook: 'Track your team like a pro coach.',
    problem: 'Disorganized team stats',
    prompt: 'Build me a roster tracker with stats for my basketball/esports team.',
    dataModel: 'players(id, name, position), game_stats(player_id, game_id, stat_type, value)',
    icon: Trophy,
    tracks: ['coders'],
    stretch: 'Sortable leaderboard table',
  },
  {
    title: 'Volunteering Hours Logger',
    hook: 'Prove your impact.',
    problem: 'Tracking community service hours for school',
    prompt: 'Build me a logger for my volunteer hours with a running total.',
    dataModel: 'entries(id, org, hours, date, verified)',
    icon: HeartHandshake,
    tracks: ['coders'],
    stretch: 'Exportable PDF summary for school',
  },
  // 14-16 Engineers
  {
    title: 'Job/Internship Application Tracker',
    hook: 'Run your job search like a pipeline.',
    problem: 'Disorganized applications',
    prompt: 'Build me a Kanban tracker for internship applications with stages.',
    dataModel: 'applications(id, company, role, stage, notes, date)',
    icon: Briefcase,
    tracks: ['engineers'],
    stretch: 'Drag-and-drop stage changes with real-time sync',
  },
  {
    title: 'Study Group Scheduler',
    hook: 'Find the one time that works for everyone.',
    problem: 'Coordinating group study times',
    prompt: 'Build me a scheduler where each member submits availability and it finds overlapping free time.',
    dataModel: 'groups(id), members(id, group_id), availability(member_id, day, start, end)',
    icon: CalendarRange,
    tracks: ['engineers'],
    stretch: 'Real overlap-computation algorithm (interval intersection)',
  },
  {
    title: 'Personal Finance Dashboard',
    hook: 'See your future balance, today.',
    problem: 'Understanding compound savings',
    prompt: 'Build me a dashboard that projects my savings goal based on weekly deposits and shows a chart.',
    dataModel: 'goals(id, target_amount, target_date), deposits(goal_id, amount, date)',
    icon: TrendingUp,
    tracks: ['engineers'],
    stretch: 'Real compound-growth formula + chart projection, portfolio-worthy for college apps',
  },
];

const FILTERS: { id: TrackId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'builders', label: 'Age 8-10' },
  { id: 'makers', label: 'Age 10-12' },
  { id: 'coders', label: 'Age 12-14' },
  { id: 'engineers', label: 'Age 14-16' },
];

const TRACK_BADGE: Record<TrackId, { label: string; className: string }> = {
  builders: { label: '8-10', className: 'bg-accent-400/15 text-accent-300 border-accent-400/20' },
  makers: { label: '10-12', className: 'bg-brand-400/15 text-brand-300 border-brand-400/20' },
  coders: { label: '12-14', className: 'bg-ocean-400/15 text-ocean-300 border-ocean-400/20' },
  engineers: { label: '14-16', className: 'bg-ink-300/15 text-ink-200 border-ink-300/20' },
};

export default function Templates() {
  const [filter, setFilter] = useState<TrackId | 'all'>('all');
  const [selected, setSelected] = useState<Template | null>(null);
  const { ref, visible } = useReveal<HTMLDivElement>();

  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.tracks.includes(filter));

  return (
    <section id="templates" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/5 blur-[120px]" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <LayoutGrid className="h-3.5 w-3.5" />
            20 Starter Templates
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Real problems, real projects, not toy demos
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Every template starts with a life problem kids actually have, a Vibe Mode
            prompt, and a stretch feature that unlocks as they edit. Click any card for
            the full spec. Filter by age track.
          </p>
        </div>

        {/* Filter pills */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                filter === f.id
                  ? 'bg-brand-400 text-ink-950 shadow-lg shadow-brand-400/20'
                  : 'border border-white/10 bg-white/5 text-ink-300 hover:text-white hover:border-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl, i) => (
            <button
              key={tpl.title}
              onClick={() => setSelected(tpl)}
              className="glass-card-hover group relative flex flex-col overflow-hidden p-6 text-left"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Track badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${TRACK_BADGE[tpl.tracks[0]].className}`}>
                  {TRACK_BADGE[tpl.tracks[0]].label}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:border-brand-400/30">
                  <tpl.icon className="h-5 w-5 text-ink-300 transition-colors group-hover:text-brand-400" strokeWidth={1.8} />
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white">{tpl.title}</h3>
              <p className="mt-1 text-sm italic text-brand-300">"{tpl.hook}"</p>

              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Problem</span>
                  <p className="text-xs text-ink-300">{tpl.problem}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Data Model</span>
                  <p className="text-xs text-ink-200 font-mono leading-relaxed">{tpl.dataModel}</p>
                </div>
              </div>

              {/* Stretch feature */}
              <div className="mt-auto pt-4">
                <div className="flex items-start gap-2 rounded-lg border border-accent-400/15 bg-accent-400/5 p-2.5">
                  <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent-400" />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-300">Stretch</span>
                    <p className="text-xs text-ink-300">{tpl.stretch}</p>
                  </div>
                </div>
              </div>

              {/* Click hint */}
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500 transition-colors group-hover:text-brand-400">
                <span>View full spec</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-400">
            Showing <span className="font-semibold text-white">{filtered.length}</span> of {TEMPLATES.length} templates
            {filter !== 'all' && <> for the <span className="font-semibold text-brand-300">{TRACK_BADGE[filter as TrackId]?.label}</span> track</>}
          </p>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <selected.icon className="h-6 w-6 text-brand-400" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">{selected.title}</h3>
                  <p className="mt-0.5 text-sm italic text-brand-300">"{selected.hook}"</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 p-6">
              {/* Track badge */}
              <div>
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${TRACK_BADGE[selected.tracks[0]].className}`}>
                  {TRACK_BADGE[selected.tracks[0]].label} track
                </span>
              </div>

              {/* Problem */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Problem Solved</span>
                <p className="mt-1 text-sm text-ink-200">{selected.problem}</p>
              </div>

              {/* Prompt */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Starter Vibe Mode Prompt</span>
                <div className="mt-1 rounded-lg border border-white/10 bg-ink-950 p-3">
                  <p className="text-sm text-ink-200 font-mono leading-relaxed">"{selected.prompt}"</p>
                </div>
              </div>

              {/* Data model */}
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  <Database className="h-3 w-3" />
                  Core Data Model
                </span>
                <div className="mt-1 rounded-lg border border-ocean-400/15 bg-ocean-400/5 p-3">
                  <p className="text-sm text-ocean-300 font-mono leading-relaxed">{selected.dataModel}</p>
                </div>
              </div>

              {/* Stretch */}
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-300">
                  <Star className="h-3 w-3" />
                  Stretch Feature
                </span>
                <div className="mt-1 rounded-lg border border-accent-400/15 bg-accent-400/5 p-3">
                  <p className="text-sm text-ink-200">{selected.stretch}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
