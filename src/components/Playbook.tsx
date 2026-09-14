import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { BookOpen, Wand2, Code2, GraduationCap, Mail, ShieldCheck, ChevronRight, type LucideIcon } from 'lucide-react';

interface PromptSpec {
  id: string;
  label: string;
  version: string;
  icon: LucideIcon;
  color: 'brand' | 'ocean' | 'accent' | 'ink';
  summary: string;
  purpose: string;
  rules: string[];
  output: string;
}

const PROMPTS: PromptSpec[] = [
  {
    id: 'plan',
    label: 'Vibe Mode: Plan',
    version: 'vibe_mode_plan_v1',
    icon: Wand2,
    color: 'ocean',
    summary: 'Called first, before any code. Turns a kid\'s idea into a friendly, confirmable plan.',
    purpose: 'A child describes what they want to build. This prompt produces a short, age-calibrated PLAN — not code — that the child (or parent) confirms before generation begins.',
    rules: [
      'If the prompt touches weapons, violence, hate, sexual content, self-harm, drugs, contacting strangers, or collecting personal data — return a kind redirect, never describe the harmful content back.',
      'No real payment processing, third-party API keys, real email/SMS to non-family, or visitor data collection.',
      'Simplest data model that solves the problem. No speculative future-proofing. A 9-year-old\'s chore chart does not need a users table with roles.',
      'Every plan maps to a real data structure and at least one real interaction — not a poster-maker.',
    ],
    output: 'Strict JSON: type (plan|redirect), title, summary, screens[], data_model[], key_interaction, stretch_idea, estimated_build_time_minutes, redirect_message.',
  },
  {
    id: 'codegen',
    label: 'Vibe Mode: Codegen',
    version: 'vibe_mode_codegen_v1',
    icon: Code2,
    color: 'brand',
    summary: 'Called after plan confirmation. Generates a working React 18 + Supabase project from the confirmed plan.',
    purpose: 'Receives the confirmed plan JSON and generates functional React components, Supabase schema with RLS, and a CHANGES.md — all calibrated to the child\'s age track.',
    rules: [
      'Functional components, hooks only, no class components. Tailwind utilities only for styling.',
      'Data access only through supabaseClient — never hardcode URLs, keys, or fetch to non-Supabase endpoints. Substitute local mock data if an external API seems needed.',
      'No eval, Function(), dangerouslySetInnerHTML, or document.write — ever.',
      'Every table matches the confirmed data_model exactly. Generate RLS-policy SQL for every table (owner-only, keyed to child\'s user id).',
      'Code style shifts by age: 10-12 gets flat components with verbose names and "what this does" comments. 14-16 gets production-idiomatic code with typed hooks and error states.',
    ],
    output: 'JSON array of file objects: [{ path, language, content }]. Minimum: main component, supabase schema.sql addendum, and CHANGES.md for 10+ tracks.',
  },
  {
    id: 'mentor',
    label: 'AI Mentor: Explain',
    version: 'ai_mentor_explain_v1',
    icon: GraduationCap,
    color: 'accent',
    summary: 'A child selects code and presses "Explain this." Gets a patient, age-calibrated explanation — never a grade.',
    purpose: 'The teaching loop. A child selects a line, block, or error message and gets an explanation calibrated to their age track, using their own variable names.',
    rules: [
      'Never say code is "wrong" or "bad." Frame corrections as "here\'s what\'s happening" and "here\'s one way to change it."',
      'Hard word-count ceilings: 10-12 max 60 words (one analogy + one real term in parentheses). 12-14 max 90 words (real terminology, their variable names). 14-16 max 120 words (terse, technical, may link to real docs).',
      'If the child seems frustrated, switch to a simpler analogy and explicitly encourage: "this concept trips up professional developers too."',
      'Never introduce a new concept the plan/code doesn\'t already use. Explain what IS there.',
      'If selected code contains something outside safety rules, do not explain it — return a redirect and flag needs_review: true.',
    ],
    output: 'Strict JSON: explanation, term_introduced (string|null), needs_review (boolean), suggested_followup_question (string|null).',
  },
  {
    id: 'email',
    label: 'Parent HQ: Email',
    version: 'parent_weekly_summary_v1',
    icon: Mail,
    color: 'ocean',
    summary: 'Generates the weekly email a parent receives about their child\'s activity — concrete, guilt-free, under 150 words.',
    purpose: 'Takes a structured 7-day activity summary (counts, not raw text) and produces a plain-text email body wrapped in an HTML template by Parent HQ.',
    rules: [
      'Never fabricate specifics not in the input. If a field is zero/empty, acknowledge it neutrally ("a quieter week") — never guilt the parent or child.',
      'Lead with the most concrete thing: a named published project + its live link, not generic congratulations.',
      'Translate concept tags into one sentence of "why this matters" in plain adult language (e.g. "loops" -> "practiced telling the computer to repeat an action automatically").',
      'Max 150 words. No exclamation-point stacking. One clear call-to-action link at the end.',
      'Never include credentials, PINs, or contact features — read-only summary.',
    ],
    output: 'Plain text email body (Parent HQ system wraps it in HTML template).',
  },
  {
    id: 'moderation',
    label: 'Publish: Moderation',
    version: 'publish_moderation_v1',
    icon: ShieldCheck,
    color: 'brand',
    summary: 'The final safety gate before a project goes live at a public URL. Classifies as approve, hold, or block.',
    purpose: 'Receives the full generated code, all user-entered strings, and age_track. Classifies the project for publish readiness.',
    rules: [
      'BLOCK: any PII pattern (full names, addresses, phones, non-parent emails, school+schedule), external data exfiltration (fetch to non-Supabase domain), sexual/violent/hateful/self-harm content, third-party tracking scripts, or reading localStorage/cookies outside the app origin.',
      'HOLD_FOR_HUMAN_REVIEW: ambiguous personal detail that might be fictional, borderline language at medium confidence, or any first publish for under-12 tracks (human-in-the-loop for youngest cohort\'s first publish only).',
      'Never approve silently by "fixing" the code yourself — block and return the specific reason so the review queue and the child\'s retry both have clear signal.',
    ],
    output: 'Strict JSON: verdict (approve|hold_for_human_review|block), reasons[] (machine-readable tags), public_facing_text_flags[] (text + issue).',
  },
];

const COLOR_MAP = {
  brand: { active: 'bg-brand-400 text-ink-950', text: 'text-brand-400', border: 'border-brand-400/20', bg: 'bg-brand-400/10', dot: 'bg-brand-400' },
  ocean: { active: 'bg-ocean-400 text-ink-950', text: 'text-ocean-400', border: 'border-ocean-400/20', bg: 'bg-ocean-400/10', dot: 'bg-ocean-400' },
  accent: { active: 'bg-accent-400 text-ink-950', text: 'text-accent-400', border: 'border-accent-400/20', bg: 'bg-accent-400/10', dot: 'bg-accent-400' },
  ink: { active: 'bg-ink-300 text-ink-950', text: 'text-ink-200', border: 'border-ink-300/20', bg: 'bg-ink-300/10', dot: 'bg-ink-300' },
};

export default function Playbook() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal<HTMLDivElement>();
  const prompt = PROMPTS[active];
  const c = COLOR_MAP[prompt.color];

  return (
    <section id="playbook" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent-500/5 blur-[120px]" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <BookOpen className="h-3.5 w-3.5" />
            Prompt Playbook
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            The prompts that make this more than "write me a todo app"
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Five system prompts encode age-calibration, mandatory plan-before-code,
            hard safety rails, and a teaching loop. This is the actual product moat.
          </p>
        </div>

        {/* Prompt selector */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {PROMPTS.map((p, i) => {
            const pc = COLOR_MAP[p.color];
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active === i
                    ? `${pc.active} shadow-lg`
                    : 'border border-white/10 bg-white/5 text-ink-300 hover:text-white hover:border-white/20'
                }`}
              >
                <p.icon className="h-4 w-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active prompt detail */}
        <div key={prompt.id} className="glass-card animate-fade-in overflow-hidden">
          <div className="grid lg:grid-cols-[300px_1fr]">
            {/* Left: Prompt header */}
            <div className="border-r border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${c.border} ${c.bg}`}>
                <prompt.icon className={`h-7 w-7 ${c.text}`} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{prompt.label}</h3>
              <code className={`mt-1 block text-xs font-mono ${c.text}`}>{prompt.version}</code>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">{prompt.summary}</p>
            </div>

            {/* Right: Spec details */}
            <div className="p-8 md:p-10">
              {/* Purpose */}
              <div className="mb-6">
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-500">Purpose</h4>
                <p className="text-sm leading-relaxed text-ink-200">{prompt.purpose}</p>
              </div>

              {/* Rules */}
              <div className="mb-6">
                <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-ink-500">Hard Rules</h4>
                <div className="space-y-3">
                  {prompt.rules.map((rule, i) => (
                    <div key={i} className="flex gap-3">
                      <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${c.dot}`} />
                      <p className="text-sm leading-relaxed text-ink-300">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output */}
              <div>
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-500">Output Format</h4>
                <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
                  <p className="text-sm font-mono leading-relaxed text-ink-200">{prompt.output}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center">
          <ChevronRight className="h-4 w-4 text-ink-500" />
          <p className="text-sm text-ink-400">
            Every prompt enforces age-calibrated tone, safety rails, and structured JSON output — no free-form AI responses reach the child.
          </p>
        </div>
      </div>
    </section>
  );
}
