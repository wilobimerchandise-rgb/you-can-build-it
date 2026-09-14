import { useReveal } from '@/hooks/useReveal';
import { Lightbulb, Wand2, Rocket, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Lightbulb,
    number: '01',
    title: 'Describe what you want',
    description:
      "Type or say \"I want a homework tracker.\" That's it. No setup, no blank editor, no intimidating terminal.",
    accent: 'from-accent-400/20 to-accent-500/5',
    iconColor: 'text-accent-400',
    border: 'border-accent-400/20',
  },
  {
    icon: Wand2,
    number: '02',
    title: 'AI builds it, then explains it',
    description:
      'Watch real code generate line by line. The AI Mentor explains every decision — "useState tracks your tasks" — so kids can\'t just click-and-ship without exposure to the code.',
    accent: 'from-brand-400/20 to-brand-500/5',
    iconColor: 'text-brand-400',
    border: 'border-brand-400/20',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Publish & share your app',
    description:
      'One click and the app is live on a real URL. Share it with friends, add it to a portfolio, or remix it into something new. Every project has real Git history.',
    accent: 'from-ocean-400/20 to-ocean-500/5',
    iconColor: 'text-ocean-400',
    border: 'border-ocean-400/20',
  },
];

export default function HowItWorks() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div ref={ref} className={`container-ycbi reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">
            <Lightbulb className="h-3.5 w-3.5" />
            How It Works
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            From idea to published app in three steps
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            No tutorials to watch first. No syntax to memorize. Kids start building
            on day one and learn the code as they go.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-accent-400/30 via-brand-400/30 to-ocean-400/30 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="relative"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`glass-card-hover group relative h-full overflow-hidden p-8`}>
                  {/* Glow */}
                  <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${step.accent} blur-2xl`} />

                  <div className="relative">
                    {/* Number + Icon */}
                    <div className="mb-6 flex items-center justify-between">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${step.border} bg-white/5`}>
                        <step.icon className={`h-7 w-7 ${step.iconColor}`} strokeWidth={1.8} />
                      </span>
                      <span className="font-display text-5xl font-bold text-white/10">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mb-3 font-display text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-300">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow between steps (mobile) */}
                {i < STEPS.length - 1 && (
                  <div className="flex justify-center py-4 lg:hidden">
                    <ArrowRight className="h-5 w-5 rotate-90 text-ink-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-12 text-center">
          <p className="text-sm text-ink-400">
            The whole flow takes under 15 minutes for 80% of first-time users age 10+
          </p>
        </div>
      </div>
    </section>
  );
}
