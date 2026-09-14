import { useReveal } from '@/hooks/useReveal';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { useUI } from '@/context/useUI';

export default function CTA() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { openAuth } = useUI();

  return (
    <section className="relative py-24 md:py-32">
      <div ref={ref} className={`container-ycbi reveal ${visible ? 'is-visible' : ''}`}>
        <div className="relative overflow-hidden rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-950 via-ink-950 to-ocean-950 p-10 md:p-16">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-ocean-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-ocean-500 shadow-xl shadow-brand-500/30">
                <Rocket className="h-8 w-8 text-ink-950" strokeWidth={2} />
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
              Your kid's first real app is one sentence away.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300 text-balance">
              No tutorials. No setup. No blank-page terror. Just type what you want
              to build and watch it come to life — with an AI mentor that teaches
              along the way.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => openAuth('signup')} className="btn-primary text-base">
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#how-it-works" className="btn-secondary text-base">
                <Sparkles className="h-4 w-4" />
                See a Demo
              </a>
            </div>

            <p className="mt-6 text-sm text-ink-400">
              Free forever. No credit card. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
