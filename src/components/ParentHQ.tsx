import { useReveal } from '@/hooks/useReveal';
import {
  Mail,
  TrendingUp,
  BookOpen,
  Code2,
  Shield,
  Calendar,
  BarChart3,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export default function ParentHQ() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="parent-hq" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean-500/5 blur-[120px]" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">
            <Mail className="h-3.5 w-3.5" />
            Parent HQ
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            "Built a todo app" becomes "practiced state management"
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Parents see learning outcomes, not just screenshots. Weekly emails
            translate what kids built into the real engineering skills they practiced.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Weekly report mockup */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-mono text-ink-400">weekly@youcanbuildit.app</span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  Alex's Weekly Build Report
                </h3>
                <span className="rounded-full bg-brand-400/10 px-2.5 py-1 text-xs font-semibold text-brand-300">
                  Week 3
                </span>
              </div>

              <p className="mb-5 text-sm text-ink-300">
                Alex published <span className="font-semibold text-white">2 projects</span> this week
                and engaged with the AI Mentor on <span className="font-semibold text-white">14 code explanations</span>.
              </p>

              {/* Skill cards */}
              <div className="space-y-3">
                <SkillCard
                  icon={Code2}
                  skill="State Management"
                  detail="Used useState in 2 projects to manage task lists and form inputs"
                  level="Practicing"
                />
                <SkillCard
                  icon={BarChart3}
                  skill="API Integration"
                  detail="Fetched data from a movie database API and rendered results"
                  level="Introduced"
                />
                <SkillCard
                  icon={BookOpen}
                  skill="Debugging"
                  detail="Fixed a key prop warning with AI Mentor guidance"
                  level="Growing"
                />
              </div>

              {/* Stats footer */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <StatBlock label="Time building" value="2h 14m" />
                <StatBlock label="Mentor opens" value="14" />
                <StatBlock label="Published" value="2" />
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-400/20 bg-brand-400/5 p-3">
                <TrendingUp className="h-4 w-4 flex-shrink-0 text-brand-400" />
                <p className="text-xs text-ink-200">
                  <span className="font-semibold text-brand-300">Trending up:</span>{' '}
                  Alex's projects are getting more complex — added API calls for the first time!
                </p>
              </div>
            </div>
          </div>

          {/* Right: Features list */}
          <div className="space-y-6">
            <Feature
              icon={Mail}
              title="Weekly email digest"
              description="Every Friday, parents get a plain-English summary: what was built, what skills were practiced, and what's trending up."
            />
            <Feature
              icon={Shield}
              title="Safety & moderation built in"
              description="100% of moderation queue actioned within 24 hours. Zero COPPA/PII incidents. Parents control project visibility and sharing."
            />
            <Feature
              icon={Calendar}
              title="Progress over time"
              description="See how your kid's builds get more sophisticated week over week. The skill graph maps code concepts to a visible learning trajectory."
            />
            <Feature
              icon={Bell}
              title="Alerts that matter"
              description="Get notified when your kid tries something new (first API call, first Git branch) — not every keystroke. Meaningful milestones only."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  icon: Icon,
  skill,
  detail,
  level,
}: {
  icon: LucideIcon;
  skill: string;
  detail: string;
  level: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-400/10">
        <Icon className="h-4.5 w-4.5 text-brand-400" strokeWidth={1.8} />
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{skill}</p>
          <span className="rounded-full bg-ocean-400/10 px-2 py-0.5 text-[10px] font-semibold text-ocean-300">
            {level}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-400">{detail}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <p className="font-display text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-ink-400">{label}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-400/10">
        <Icon className="h-5.5 w-5.5 text-brand-400" strokeWidth={1.8} />
      </span>
      <div>
        <h3 className="font-display text-base font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-300">{description}</p>
      </div>
    </div>
  );
}
