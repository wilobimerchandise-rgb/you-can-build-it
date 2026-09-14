import { useReveal } from '@/hooks/useReveal';
import { Compass, Database, LayoutTemplate, Wand2, Rocket, Mail, Check, type LucideIcon } from 'lucide-react';

interface RoadmapItem {
  step: number;
  title: string;
  detail: string;
  icon: LucideIcon;
  tag: string;
}

const ITEMS: RoadmapItem[] = [
  {
    step: 1,
    title: 'Supabase schema + RLS + parent/child auth',
    detail: 'The compliance backbone. Get the database, row-level security, and the parent-account-holds-child-subaccounts auth flow right before anything else.',
    icon: Database,
    tag: 'Compliance',
  },
  {
    step: 2,
    title: 'Hardcode 5 templates for 8-10 and 10-12 tracks',
    detail: 'No live AI yet. Validate the age-tiered UI and the full publish pipeline end-to-end before spending on AI generation cost.',
    icon: LayoutTemplate,
    tag: 'Validation',
  },
  {
    step: 3,
    title: 'Wire vibe_mode_plan_v1 + codegen_v1 to one category',
    detail: 'Trackers/loggers — 8 of 20 templates are variations on "log something, show a total or streak." Prove the AI loop works before generalizing.',
    icon: Wand2,
    tag: 'AI Loop',
  },
  {
    step: 4,
    title: 'Publish-to-subdomain pipeline',
    detail: 'The "wow" moment. Vercel deploy API provisioning kidname-app.youcanbuildit.app. Make it bulletproof, demo it constantly.',
    icon: Rocket,
    tag: 'Wow Factor',
  },
  {
    step: 5,
    title: 'Parent HQ v0: activity log + one weekly email',
    detail: 'Just the essentials. Skip the fancy skill graph until v1.1. Ship the activity timeline and the weekly summary email to prove the oversight layer.',
    icon: Mail,
    tag: 'Oversight',
  },
];

export default function Roadmap() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/50 to-transparent" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">
            <Compass className="h-3.5 w-3.5" />
            Build Roadmap
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            What I'd build first with two weeks
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Five steps, in priority order. Compliance and validation before AI cost.
            The publish pipeline is the demo centerpiece — protect it relentlessly.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="pointer-events-none absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-brand-400/40 via-ocean-400/30 to-transparent sm:left-[31px]" />

          <div className="space-y-8">
            {ITEMS.map((item, i) => (
              <div
                key={item.step}
                className="relative flex gap-5 sm:gap-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Step number circle */}
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-ink-900 shadow-lg">
                  <item.icon className="h-6 w-6 text-brand-400" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-display text-xs font-bold text-ink-500">
                      Step {item.step}
                    </span>
                    <span className="rounded-full border border-brand-400/20 bg-brand-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}

            {/* End marker */}
            <div className="relative flex gap-5 sm:gap-6">
              <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-success-500/20 bg-success-500/10 shadow-lg">
                <Check className="h-7 w-7 text-success-500" strokeWidth={2.5} />
              </div>
              <div className="flex-1 pt-2">
                <h3 className="font-display text-base font-bold text-success-500">
                  v1 MVP shipped
                </h3>
                <p className="mt-1 text-sm text-ink-400">
                  Skill graph, broader template coverage, and polish come in v1.1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
