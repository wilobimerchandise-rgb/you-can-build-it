import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import {
  UserPlus,
  LayoutDashboard,
  Wand2,
  Code2,
  Rocket,
  Mail,
  Check,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface FlowStep {
  title: string;
  detail: string;
}

interface Flow {
  id: string;
  label: string;
  icon: LucideIcon;
  color: 'brand' | 'ocean' | 'accent' | 'ink';
  steps: FlowStep[];
}

const FLOWS: Flow[] = [
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: UserPlus,
    color: 'accent',
    steps: [
      { title: 'Parent creates account', detail: 'Parent enters their email and creates the family account via Supabase Auth.' },
      { title: 'Add your builder', detail: 'Parent enters child\'s first name/nickname + birth year. Birth year computes the age track automatically.' },
      { title: 'Consent screen', detail: 'Plain-language data disclosure, AI usage notice, COPPA notice. Checkbox consent required to proceed.' },
      { title: 'Child gets a PIN login', detail: 'No email/password for under 13. Picture-password or PIN tied to the parent account.' },
      { title: '60-second intro', detail: 'Animated "what you can build" intro — skippable, captioned, no audio-only content.' },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'brand',
    steps: [
      { title: 'Four persistent zones', detail: 'Start New Project, My Published Apps, Badges, and Learn.' },
      { title: 'Same architecture, all tracks', detail: 'Age-adaptive presentation but identical information architecture — graduating tracks doesn\'t get a kid lost.' },
      { title: 'Age-adaptive density', detail: 'High contrast + large tap targets for 8-10, muted workshop palette for 12-14, neutral pro theme for 14-16.' },
    ],
  },
  {
    id: 'vibe-mode',
    label: 'Vibe Mode',
    icon: Wand2,
    color: 'ocean',
    steps: [
      { title: '"What do you want to build?"', detail: '8-10: voice-first with 6 illustrated example prompts. 10+: type or speak.' },
      { title: 'Server-side moderation pre-check', detail: 'Prompt is moderated before any AI call is made.' },
      { title: 'AI returns a plan, not code yet', detail: 'Structured checklist of screens, data model, and components shown for kid confirmation.' },
      { title: '"Yes, build it!" confirmation', detail: 'Mandatory confirm step — kids can\'t skip straight to code.' },
      { title: 'Streamed code generation', detail: 'React component tree + Supabase schema, rendered in a live sandboxed preview iframe.' },
    ],
  },
  {
    id: 'editor',
    label: 'Code Editor',
    icon: Code2,
    color: 'brand',
    steps: [
      { title: 'Monaco editor (10+ tracks)', detail: 'AI-generated code loaded with syntax highlighting. Simplified Monaco for 10-12, full Monaco for 12+.' },
      { title: '"Explain this line" AI Mentor', detail: 'Any line or selection triggers an age-calibrated plain-language explanation.' },
      { title: 'Manual edits hot-reload', detail: 'Kids see their changes live in the sandboxed preview instantly.' },
      { title: 'Diff view: AI vs. you', detail: 'Shows what changed since last AI generation so kids see their own contribution.' },
    ],
  },
  {
    id: 'publish',
    label: 'Publish',
    icon: Rocket,
    color: 'ocean',
    steps: [
      { title: 'Final automated safety pass', detail: 'Moderation + static analysis + secrets scan on the generated code.' },
      { title: 'Vercel Deploy API call', detail: 'Server provisions kidname-app.youcanbuildit.app subdomain. Name collisions get auto-suffixed.' },
      { title: 'Confetti + shareable link', detail: 'Success screen with confetti. Share limited to copy-link or parent\'s contacts — no open social sharing.' },
      { title: 'Parent approval gate', detail: 'Under 14: family-only link by default. Parent must approve to make it public.' },
      { title: 'Badge check runs', detail: 'Rules-based badge engine fires (e.g., "First App") — not AI-graded, fully auditable.' },
    ],
  },
  {
    id: 'parent-hq',
    label: 'Parent HQ',
    icon: Mail,
    color: 'accent',
    steps: [
      { title: 'Separate parent login', detail: 'Parent\'s own Supabase Auth session, RLS scoped to their child accounts only.' },
      { title: 'Activity timeline', detail: 'Append-only event stream: projects created, code edited, mentor opened, published, badges earned.' },
      { title: 'Focus sessions, not screen time', detail: 'Time-on-task framed positively — not punitive "screen time" monitoring.' },
      { title: 'Skills-learned tag cloud', detail: 'Derived from template/category metadata, not AI-graded essays.' },
      { title: 'Weekly summary email', detail: 'Sent every Friday via Resend/Postmark with a plain-English learning digest.' },
    ],
  },
];

const COLOR_MAP = {
  brand: { active: 'bg-brand-400 text-ink-950', text: 'text-brand-400', border: 'border-brand-400/20', bg: 'bg-brand-400/10', dot: 'bg-brand-400' },
  ocean: { active: 'bg-ocean-400 text-ink-950', text: 'text-ocean-400', border: 'border-ocean-400/20', bg: 'bg-ocean-400/10', dot: 'bg-ocean-400' },
  accent: { active: 'bg-accent-400 text-ink-950', text: 'text-accent-400', border: 'border-accent-400/20', bg: 'bg-accent-400/10', dot: 'bg-accent-400' },
  ink: { active: 'bg-ink-300 text-ink-950', text: 'text-ink-200', border: 'border-ink-300/20', bg: 'bg-ink-300/10', dot: 'bg-ink-300' },
};

export default function UserFlows() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal<HTMLDivElement>();
  const flow = FLOWS[active];
  const c = COLOR_MAP[flow.color];

  return (
    <section id="user-flows" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-ocean-500/5 blur-[120px]" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <ChevronRight className="h-3.5 w-3.5" />
            Core User Flows
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Every path from idea to published app, mapped
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Six flows make up the entire product experience — from a parent's first
            signup to a kid's weekly learning digest. Click through each one.
          </p>
        </div>

        {/* Flow selector */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FLOWS.map((f, i) => {
            const fc = COLOR_MAP[f.color];
            return (
              <button
                key={f.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active === i
                    ? `${fc.active} shadow-lg`
                    : 'border border-white/10 bg-white/5 text-ink-300 hover:text-white hover:border-white/20'
                }`}
              >
                <f.icon className="h-4 w-4" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active flow detail */}
        <div key={flow.id} className="glass-card animate-fade-in overflow-hidden">
          <div className="grid lg:grid-cols-[280px_1fr]">
            {/* Left: Flow header */}
            <div className={`border-r border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8`}>
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${c.border} ${c.bg}`}>
                <flow.icon className={`h-7 w-7 ${c.text}`} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{flow.label}</h3>
              <p className="mt-2 text-sm text-ink-400">
                {flow.steps.length} steps
              </p>
            </div>

            {/* Right: Steps timeline */}
            <div className="p-8 md:p-10">
              <div className="relative">
                {/* Vertical line */}
                <div className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

                <div className="space-y-6">
                  {flow.steps.map((step, i) => (
                    <div key={i} className="relative flex gap-5">
                      {/* Step dot */}
                      <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${c.border} bg-ink-950`}>
                        <span className={`text-xs font-bold ${c.text}`}>{i + 1}</span>
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pb-2">
                        <h4 className="font-display text-sm font-bold text-white">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-ink-300">{step.detail}</p>
                      </div>
                    </div>
                  ))}

                  {/* End marker */}
                  <div className="relative flex gap-5">
                    <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${c.bg} border-2 ${c.border}`}>
                      <Check className={`h-4 w-4 ${c.text}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-400">Flow complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
