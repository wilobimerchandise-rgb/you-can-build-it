import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Check, Sparkles, Users, School, ArrowRight } from 'lucide-react';
import { useUI } from '@/context/useUI';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: Sparkles,
    price: { monthly: '$0', yearly: '$0' },
    description: 'Perfect for trying it out',
    features: [
      '1 active project',
      '3 starter templates',
      'Watermarked publish URL (*.ycbi.app)',
      'Basic AI Mentor explanations',
      'Community support',
    ],
    cta: 'Start Building Free',
    highlight: false,
    accent: 'from-ink-700 to-ink-800',
  },
  {
    id: 'family',
    name: 'Family',
    icon: Users,
    price: { monthly: '$12.99', yearly: '$99' },
    period: { monthly: '/mo', yearly: '/yr' },
    description: 'Everything for young builders at home',
    features: [
      'Unlimited projects',
      'All 20+ templates',
      'Custom subdomain (yourname.ycbi.app)',
      'Parent HQ weekly report + skill tracking',
      'Priority AI Mentor responses',
      'Remix mode within family',
      'No watermark',
    ],
    cta: 'Start Family Plan',
    highlight: true,
    accent: 'from-brand-500 to-ocean-500',
    badge: 'Most popular',
  },
  {
    id: 'school',
    name: 'School / Class',
    icon: School,
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For classrooms and clubs',
    features: [
      'Everything in Family, plus:',
      'Teacher dashboard with roster import',
      'Plagiarism-safe "explain your code" checkpoints',
      'Class analytics & progress tracking',
      'Per-seat annual pricing',
      'Dedicated onboarding session',
    ],
    cta: 'Contact Sales',
    highlight: false,
    accent: 'from-ocean-600 to-ink-700',
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { openAuth, toast } = useUI();

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/8 blur-[120px]" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Start free. Upgrade when they're hooked.
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            No credit card to start. Cancel anytime. Every plan is COPPA-safe and
            fully moderated.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                billing === 'monthly' ? 'bg-white text-ink-950' : 'text-ink-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                billing === 'yearly' ? 'bg-white text-ink-950' : 'text-ink-300 hover:text-white'
              }`}
            >
              Yearly
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${billing === 'yearly' ? 'bg-brand-500/20 text-brand-700' : 'bg-brand-400/10 text-brand-300'}`}>
                Save 36%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 ${
                plan.highlight
                  ? 'border-brand-400/40 bg-gradient-to-b from-brand-400/[0.08] to-transparent shadow-2xl shadow-brand-500/10 lg:scale-105'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {plan.badge && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-brand-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7">
                {/* Icon */}
                <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.accent} shadow-lg`}>
                  <plan.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                </span>

                <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-ink-400">{plan.description}</p>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-white">
                    {billing === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  {plan.price.monthly !== '$0' && plan.price.monthly !== 'Custom' && (
                    <span className="text-sm text-ink-400">
                      {billing === 'monthly' ? '/mo' : '/yr'}
                    </span>
                  )}
                </div>
                {plan.id === 'family' && billing === 'yearly' && (
                  <p className="mt-1 text-xs text-brand-300">
                    That's $8.25/mo — billed annually
                  </p>
                )}

                {/* CTA */}
                <button
                  onClick={() => {
                    if (plan.id === 'free') {
                      openAuth('signup');
                    } else if (plan.id === 'family') {
                      openAuth('signup');
                      toast('Family plan selected — create your account to continue.');
                    } else {
                      toast('Our sales team will reach out shortly!', 'info');
                    }
                  }}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-brand-400 text-ink-950 hover:bg-brand-300 hover:shadow-lg hover:shadow-brand-400/30'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Features */}
              <div className="mt-auto border-t border-white/10 p-7">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.highlight ? 'bg-brand-400/20' : 'bg-white/5'}`}>
                        <Check className={`h-3 w-3 ${plan.highlight ? 'text-brand-400' : 'text-ink-300'}`} />
                      </span>
                      <span className="text-sm text-ink-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-ink-400">
            All plans include COPPA compliance, 24h moderation SLA, and zero PII storage.
            No credit card required for Free tier.
          </p>
        </div>
      </div>
    </section>
  );
}
