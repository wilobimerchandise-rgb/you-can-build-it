import { useReveal } from '@/hooks/useReveal';
import { Shield, ShieldAlert, ShieldCheck, Lock, Eye, DollarSign, GraduationCap, type LucideIcon } from 'lucide-react';

interface Risk {
  icon: LucideIcon;
  risk: string;
  mitigation: string;
  color: 'brand' | 'ocean' | 'accent';
}

const RISKS: Risk[] = [
  {
    icon: ShieldAlert,
    risk: 'AI generates unsafe or inappropriate code',
    mitigation: 'Server-side moderation on input AND output. Sandboxed iframe preview with no external network. Allowlisted domains only. Human review queue for anything flagged.',
    color: 'brand',
  },
  {
    icon: Eye,
    risk: 'Kid publishes embarrassing or unsafe content',
    mitigation: 'Family-only link by default for all tracks under 14. Parent-approval gate to make any project public.',
    color: 'ocean',
  },
  {
    icon: Lock,
    risk: 'COPPA violation via careless data collection',
    mitigation: 'Data minimization by design: no last name, no email, no photo without per-instance consent. Legal review before launch. DPA with all third-party providers.',
    color: 'accent',
  },
  {
    icon: DollarSign,
    risk: 'AI cost runaway',
    mitigation: 'Per-kid daily generation quota. Cached template starting points reduce full-generation calls. Cheaper model for "explain this line" vs. full code generation.',
    color: 'brand',
  },
  {
    icon: GraduationCap,
    risk: 'Kids click-generate-publish without learning',
    mitigation: 'Mandatory "confirm the plan" step before code writes. Badges require at least one AI-Mentor open per project. Parent HQ surfaces mentor engagement as its headline metric.',
    color: 'ocean',
  },
];

const COLOR_MAP = {
  brand: { bg: 'bg-brand-400/10', border: 'border-brand-400/20', text: 'text-brand-400', glow: 'bg-brand-400/10' },
  ocean: { bg: 'bg-ocean-400/10', border: 'border-ocean-400/20', text: 'text-ocean-400', glow: 'bg-ocean-400/10' },
  accent: { bg: 'bg-accent-400/10', border: 'border-accent-400/20', text: 'text-accent-400', glow: 'bg-accent-400/10' },
};

export default function Safety() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="safety" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/50 to-transparent" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">
            <Shield className="h-3.5 w-3.5" />
            Safety & Trust
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Safety isn't a feature. It's the foundation.
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Every risk we identified has a concrete mitigation already built into the
            product. Zero COPPA/PII incidents is not an aspiration — it's the design.
          </p>
        </div>

        {/* Risk grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {RISKS.map((item, i) => {
            const c = COLOR_MAP[item.color];
            return (
              <div
                key={item.risk}
                className="glass-card-hover group relative overflow-hidden p-7"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${c.glow} blur-2xl opacity-50 transition-opacity group-hover:opacity-100`} />

                <div className="relative flex gap-5">
                  <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}>
                    <item.icon className={`h-6 w-6 ${c.text}`} strokeWidth={1.8} />
                  </span>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>Risk</span>
                      <span className="text-ink-600">→</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-success-500">Mitigated</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">
                      {item.risk}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">
                      {item.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom assurance bar */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-400/20 bg-brand-400/[0.03] p-6 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-semibold text-white">100% moderation within 24h</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-semibold text-white">Zero PII stored</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-semibold text-white">Parent-controlled visibility</span>
          </div>
        </div>
      </div>
    </section>
  );
}
