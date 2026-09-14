import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import {
  Sticker,
  Blocks,
  Code2,
  GitBranch,
  Check,
  Sparkles,
  Eye,
  Terminal,
  BookOpen,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

const COLOR_STYLES = {
  accent: { bg: 'bg-accent-400/15', border: 'border-accent-400/20', text: 'text-accent-400' },
  brand: { bg: 'bg-brand-400/15', border: 'border-brand-400/20', text: 'text-brand-400' },
  ocean: { bg: 'bg-ocean-400/15', border: 'border-ocean-400/20', text: 'text-ocean-400' },
  ink: { bg: 'bg-ink-300/15', border: 'border-ink-300/20', text: 'text-ink-200' },
} as const;

const TRACKS = [
  {
    id: 'builders',
    label: 'Age 8–10',
    name: 'Builders',
    tagline: 'Can read, can\'t type well, loves stickers & games',
    icon: Sticker,
    color: 'accent' as const,
    ui: 'Drag-and-drop blocks + voice input',
    codeVisible: 'Never see a line of code',
    mentor: 'Mentor explains in pictures & audio',
    publish: 'One-tap publish with a celebration animation',
    features: [
      'Voice-first "Vibe Mode" — just speak your idea',
      'Sticker-based UI — no typing required',
      'Pet companion that reacts to your builds',
      'Auto-published to a shareable URL',
    ],
    skillFocus: 'Sequencing, cause & effect, pattern recognition',
  },
  {
    id: 'makers',
    label: 'Age 10–12',
    name: 'Makers',
    tagline: 'First real typing fluency, likes Roblox/Minecraft logic',
    icon: Blocks,
    color: 'brand' as const,
    ui: 'Mixed blocks + simple text editor',
    codeVisible: 'See code in read-only "peek" mode',
    mentor: 'Mentor explains each block in plain English',
    publish: 'Publish with optional "Built with YCBI" badge',
    features: [
      'Hybrid blocks-to-code view',
      'Click any block to see the real code behind it',
      '20+ starter templates (games, trackers, quizzes)',
      'Remix any project in your family plan',
    ],
    skillFocus: 'Variables, events, conditionals, basic state',
  },
  {
    id: 'coders',
    label: 'Age 12–14',
    name: 'Coders',
    tagline: 'Wants to look competent, cares about aesthetics',
    icon: Code2,
    color: 'ocean' as const,
    ui: 'Real text editor with syntax highlighting',
    codeVisible: 'Full code visible with inline AI explanations',
    mentor: 'Mentor explains decisions, suggests improvements',
    publish: 'Custom subdomain + portfolio-ready URL',
    features: [
      'Real React + TypeScript editor',
      'AI Mentor: "I used useState here because..."',
      'Style editor — make it look professional',
      'Git history with meaningful commit messages',
    ],
    skillFocus: 'Components, props, state, API calls, debugging',
  },
  {
    id: 'engineers',
    label: 'Age 14–16',
    name: 'Engineers',
    tagline: 'College/portfolio-aware, wants real tools',
    icon: GitBranch,
    color: 'ink' as const,
    ui: 'Full IDE with Git, terminal, and package manager',
    codeVisible: 'Full code, real Git history, real dependencies',
    mentor: 'Mentor does code review, flags anti-patterns',
    publish: 'Export to GitHub, deploy to custom domain',
    features: [
      'Full Git workflow — branch, commit, merge',
      'Real npm packages and external APIs',
      'AI Mentor code review before publish',
      'Export portfolio-ready GitHub repo',
    ],
    skillFocus: 'Architecture, testing, deployment, engineering literacy',
  },
];

export default function AgeTracks() {
  const [active, setActive] = useState(1);
  const { ref, visible } = useReveal<HTMLDivElement>();
  const track = TRACKS[active];

  return (
    <section id="age-tracks" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/50 to-transparent" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <Sparkles className="h-3.5 w-3.5" />
            Age-Adaptive Tracks
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            The interface grows up with your kid
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            At 8, they never see a line of code. At 16, they're in a real editor
            with real Git history. The AI doesn't just generate — it teaches.
          </p>
        </div>

        {/* Track selector tabs */}
        <div className="mb-10 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            {TRACKS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active === i
                    ? 'bg-brand-400 text-ink-950 shadow-lg shadow-brand-400/20'
                    : 'text-ink-300 hover:text-white'
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active track detail */}
        <div key={track.id} className="glass-card animate-fade-in overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: Track info */}
            <div className="p-8 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${COLOR_STYLES[track.color].bg} border ${COLOR_STYLES[track.color].border}`}>
                  <track.icon className={`h-6 w-6 ${COLOR_STYLES[track.color].text}`} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">{track.name}</h3>
                  <p className="text-sm text-ink-400">{track.label}</p>
                </div>
              </div>

              <p className="mb-6 text-sm italic text-ink-300">"{track.tagline}"</p>

              <div className="space-y-3">
                {track.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-400/20">
                      <Check className="h-3 w-3 text-brand-400" />
                    </span>
                    <span className="text-sm text-ink-200">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  <GraduationCap className="h-4 w-4" />
                  Skills practiced
                </div>
                <p className="mt-2 text-sm text-ink-200">{track.skillFocus}</p>
              </div>
            </div>

            {/* Right: Visual representation */}
            <div className="border-l border-white/10 bg-ink-950/40 p-8 md:p-10">
              <div className="space-y-4">
                <TrackRow icon={Eye} label="What they see" value={track.ui} />
                <TrackRow icon={Code2} label="Code visibility" value={track.codeVisible} />
                <TrackRow icon={BookOpen} label="AI Mentor role" value={track.mentor} />
                <TrackRow icon={Terminal} label="Publishing" value={track.publish} />
              </div>

              {/* Visual: code visibility meter */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-ink-400">Code exposure level</span>
                  <span className="font-mono text-ink-300">
                    {active === 0 ? '0%' : active === 1 ? '25%' : active === 2 ? '70%' : '100%'}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-ocean-400 transition-all duration-700 ease-out"
                    style={{ width: active === 0 ? '4%' : active === 1 ? '25%' : active === 2 ? '70%' : '100%' }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  {active === 0
                    ? 'Pure visual building — zero code exposure'
                    : active === 1
                    ? 'Code is visible but read-only, explained in plain English'
                    : active === 2
                    ? 'Full code with inline AI explanations and suggestions'
                    : 'Real IDE, real Git, real dependencies — portfolio-ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrackRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-400" strokeWidth={1.8} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        <p className="mt-1 text-sm text-ink-100">{value}</p>
      </div>
    </div>
  );
}
