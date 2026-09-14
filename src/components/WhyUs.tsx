import { useReveal } from '@/hooks/useReveal';
import {
  BookOpen,
  Rocket,
  Shield,
  Users,
  GitBranch,
  Sparkles,
  Zap,
} from 'lucide-react';

const COLOR_STYLES = {
  brand: { glow: 'bg-brand-400/10', border: 'border-brand-400/20', bg: 'bg-brand-400/10', text: 'text-brand-400' },
  ocean: { glow: 'bg-ocean-400/10', border: 'border-ocean-400/20', bg: 'bg-ocean-400/10', text: 'text-ocean-400' },
  accent: { glow: 'bg-accent-400/10', border: 'border-accent-400/20', bg: 'bg-accent-400/10', text: 'text-accent-400' },
} as const;

const DIFFERENTIATORS = [
  {
    icon: Sparkles,
    title: 'AI Mentor explains every line',
    description:
      'Kids can\'t just click-and-ship. The AI Mentor breaks down every decision — "I used useState because your list needs to change" — so exposure to real code is built into the flow.',
    color: 'brand' as const,
  },
  {
    icon: Rocket,
    title: 'Real publish-to-URL pipeline',
    description:
      'Every project gets a live, shareable URL. No "pretend" builds. Friends, teachers, and parents can actually use what the kid made.',
    color: 'ocean' as const,
  },
  {
    icon: BookOpen,
    title: 'Age-adaptive UI that teaches',
    description:
      'The interface itself teaches. At 8 it\'s blocks and voice. At 16 it\'s a real IDE with Git. No other tool grows with your kid — they either outgrow it or start too hard.',
    color: 'accent' as const,
  },
  {
    icon: Shield,
    title: 'COPPA-safe & moderated',
    description:
      'Zero PII incidents. Every published project goes through moderation. Parents control visibility. Safety isn\'t a feature — it\'s the foundation.',
    color: 'brand' as const,
  },
  {
    icon: GitBranch,
    title: 'Real Git history from day one',
    description:
      'Every project has real commit history with meaningful messages. By 14–16, kids have a GitHub-ready portfolio they actually understand.',
    color: 'ocean' as const,
  },
  {
    icon: Users,
    title: 'Parent HQ translates builds to skills',
    description:
      '"Built a todo app" becomes "practiced state management, API calls, and debugging." Parents see learning outcomes, not just screenshots.',
    color: 'accent' as const,
  },
];

type ComparisonValue = boolean | 'partial';

const COMPARISONS: { feature: string; ycbi: ComparisonValue; scratch: ComparisonValue; replit: ComparisonValue; chatgpt: ComparisonValue }[] = [
  { feature: 'Age-adaptive interface', ycbi: true, scratch: false, replit: false, chatgpt: false },
  { feature: 'AI explains its own code', ycbi: true, scratch: false, replit: false, chatgpt: 'partial' },
  { feature: 'Real publish-to-URL', ycbi: true, scratch: 'partial', replit: true, chatgpt: false },
  { feature: 'Real Git history', ycbi: true, scratch: false, replit: true, chatgpt: false },
  { feature: 'Parent reporting layer', ycbi: true, scratch: false, replit: false, chatgpt: false },
  { feature: 'COPPA-safe moderation', ycbi: true, scratch: 'partial', replit: false, chatgpt: false },
  { feature: 'Transferable to real coding', ycbi: true, scratch: false, replit: true, chatgpt: 'partial' },
];

export default function WhyUs() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="why-us" className="relative py-24 md:py-32">
      <div ref={ref} className={`container-ycbi reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">
            <Zap className="h-3.5 w-3.5" />
            Why YouCanBuildIt
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Not a toy. Not a blank IDE. The on-ramp.
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Scratch is too abstract. Replit is too blank. ChatGPT wrappers have no
            pedagogy. YouCanBuildIt is the ramp between them.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map((item, i) => (
            <div
              key={item.title}
              className="glass-card-hover group relative overflow-hidden p-7"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${COLOR_STYLES[item.color].glow} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`} />

              <div className="relative">
                <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${COLOR_STYLES[item.color].border} ${COLOR_STYLES[item.color].bg}`}>
                  <item.icon className={`h-6 w-6 ${COLOR_STYLES[item.color].text}`} strokeWidth={1.8} />
                </span>
                <h3 className="mb-3 font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-6">
            <h3 className="font-display text-lg font-bold text-white">
              How we compare
            </h3>
            <p className="mt-1 text-sm text-ink-400">
              The gap between "blocks" and "real code" is where most kids quit. We fill it.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Feature
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-brand-300">
                    YouCanBuildIt
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Scratch
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Replit
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">
                    ChatGPT wrapper
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                  >
                    <td className="p-4 text-sm font-medium text-ink-200">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center">
                      <CompareCell value={row.ycbi} highlight />
                    </td>
                    <td className="p-4 text-center">
                      <CompareCell value={row.scratch} />
                    </td>
                    <td className="p-4 text-center">
                      <CompareCell value={row.replit} />
                    </td>
                    <td className="p-4 text-center">
                      <CompareCell value={row.chatgpt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareCell({ value, highlight }: { value: boolean | 'partial'; highlight?: boolean }) {
  if (value === true) {
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${highlight ? 'bg-brand-400/20' : 'bg-success-500/10'}`}>
        <svg className={`h-3.5 w-3.5 ${highlight ? 'text-brand-400' : 'text-success-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warning-500/10">
        <span className="text-xs text-warning-500">~</span>
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
      <svg className="h-3.5 w-3.5 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}
