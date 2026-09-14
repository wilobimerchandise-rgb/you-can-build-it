import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Terminal,
  Eye,
  Check,
  GitBranch,
  Play,
} from 'lucide-react';
import { useUI } from '@/context/useUI';

const PROMPTS = [
  'I want a homework tracker',
  'I want a pet memory game',
  'I want a movie rating app',
];

const CODE_LINES = [
  { text: 'function HomeworkTracker() {', indent: 0 },
  { text: 'const [tasks, setTasks] = useState([]);', indent: 1 },
  { text: 'const addTask = (text) => {', indent: 1 },
  { text: 'setTasks([...tasks, { id: Date.now(), text }]);', indent: 2 },
  { text: '};', indent: 1 },
  { text: 'return (', indent: 1 },
  { text: '<div className="tracker">', indent: 2 },
  { text: '<h1>My Homework</h1>', indent: 3 },
  { text: '{tasks.map(t => <Task key={t.id} />)}', indent: 3 },
  { text: '</div>', indent: 2 },
  { text: ');', indent: 1 },
  { text: '}', indent: 0 },
];

const APP_TASKS = [
  { text: 'Math worksheet p.42', done: true },
  { text: 'Read chapter 7', done: true },
  { text: 'Science project research', done: false },
  { text: 'Spanish vocab practice', done: false },
];

export default function Hero() {
  const { openAuth } = useUI();
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'generating' | 'code' | 'app' | 'done'>('typing');
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    const fullPrompt = PROMPTS[promptIndex];

    if (phase === 'typing') {
      if (typedText.length < fullPrompt.length) {
        const timer = setTimeout(() => {
          setTypedText(fullPrompt.slice(0, typedText.length + 1));
        }, 55);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setPhase('generating'), 800);
        return () => clearTimeout(timer);
      }
    }

    if (phase === 'generating') {
      const timer = setTimeout(() => {
        setPhase('code');
        setActiveTab('code');
        setVisibleCodeLines(0);
      }, 2200);
      return () => clearTimeout(timer);
    }

    if (phase === 'code') {
      if (visibleCodeLines < CODE_LINES.length) {
        const timer = setTimeout(() => setVisibleCodeLines((v) => v + 1), 180);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase('app');
          setActiveTab('preview');
        }, 800);
        return () => clearTimeout(timer);
      }
    }

    if (phase === 'app') {
      const timer = setTimeout(() => setPhase('done'), 2500);
      return () => clearTimeout(timer);
    }

    if (phase === 'done') {
      const timer = setTimeout(() => {
        setPhase('typing');
        setTypedText('');
        setPromptIndex((i) => (i + 1) % PROMPTS.length);
        setVisibleCodeLines(0);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, typedText, promptIndex, visibleCodeLines]);

  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-ocean-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-0 top-60 h-[300px] w-[300px] rounded-full bg-accent-500/5 blur-[100px]" />

      <div className="container-ycbi relative z-10">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-4 py-2 text-xs font-medium text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>For kids 8–16 who want to build real things</span>
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Turn a sentence into a{' '}
            <span className="text-gradient-brand">real app</span>
            <br className="hidden sm:block" /> in under 15 minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-300 text-balance">
            YouCanBuildIt is where kids go from "I want a homework tracker" to a
            published, shareable app — with an AI mentor that explains every line
            along the way. No blank-page terror. No toy blocks. Just real code,
            age-adapted.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => openAuth('signup')} className="btn-primary text-base">
            Start Building Free
            <ArrowRight className="h-4 w-4" />
          </button>
          <a href="#how-it-works" className="btn-secondary text-base">
            <Play className="h-4 w-4" />
            See How It Works
          </a>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
          {[
            { value: '<15 min', label: 'Idea to published app' },
            { value: '20+', label: 'Project templates' },
            { value: '4', label: 'Age-adaptive tracks' },
            { value: '100%', label: 'COPPA-safe & moderated' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-ink-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Demo Card */}
        <div className="mx-auto mt-16 max-w-5xl">
          <DemoCard
            promptIndex={promptIndex}
            typedText={typedText}
            phase={phase}
            visibleCodeLines={visibleCodeLines}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Trust line */}
        <div className="mt-12 text-center">
          <p className="text-sm text-ink-400">
            Trusted by parents, educators, and{' '}
            <span className="text-ink-200">12,000+ young builders</span> worldwide
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}

function DemoCard({
  promptIndex,
  typedText,
  phase,
  visibleCodeLines,
  activeTab,
  setActiveTab,
}: {
  promptIndex: number;
  typedText: string;
  phase: string;
  visibleCodeLines: number;
  activeTab: 'code' | 'preview';
  setActiveTab: (t: 'code' | 'preview') => void;
}) {
  return (
    <div className="glass-card overflow-hidden shadow-2xl shadow-brand-500/5">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-error-500/80" />
          <span className="h-3 w-3 rounded-full bg-warning-500/80" />
          <span className="h-3 w-3 rounded-full bg-success-500/80" />
        </div>
        <div className="ml-3 flex items-center gap-2 text-xs text-ink-400">
          <span className="font-mono">ycbi.app/build</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-md bg-brand-400/10 px-2 py-1 text-[10px] font-semibold text-brand-300">
            Track: Age {promptIndex === 1 ? '8–10' : promptIndex === 2 ? '12–14' : '10–12'}
          </span>
        </div>
      </div>

      {/* Prompt bar */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3">
          <Wand2 className={`h-5 w-5 flex-shrink-0 transition-colors ${phase === 'generating' ? 'text-brand-400 animate-pulse' : 'text-ink-400'}`} />
          <span className="font-mono text-sm text-ink-100">
            {typedText}
            {phase === 'typing' && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-brand-400" />}
          </span>
          {phase === 'generating' && (
            <span className="ml-auto flex items-center gap-2 text-xs text-brand-300">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </span>
          )}
          {(phase === 'code' || phase === 'app' || phase === 'done') && (
            <span className="ml-auto flex items-center gap-1.5 text-xs text-success-500">
              <Check className="h-3.5 w-3.5" />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'code' ? 'border-b-2 border-brand-400 text-white' : 'text-ink-400 hover:text-ink-200'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          Code
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'preview' ? 'border-b-2 border-brand-400 text-white' : 'text-ink-400 hover:text-ink-200'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Live Preview
        </button>
        <div className="ml-auto flex items-center gap-2 px-4">
          <GitBranch className="h-3.5 w-3.5 text-ink-500" />
          <span className="text-[10px] text-ink-500 font-mono">main</span>
        </div>
      </div>

      {/* Content area */}
      <div className="min-h-[340px] bg-ink-950/30 p-5">
        {activeTab === 'code' ? (
          <div className="font-mono text-[13px] leading-relaxed">
            {CODE_LINES.slice(0, visibleCodeLines).map((line, i) => (
              <div key={i} className="flex animate-fade-in items-start" style={{ animationDuration: '0.3s' }}>
                <span className="mr-4 w-6 flex-shrink-0 text-right text-ink-600 select-none">{i + 1}</span>
                <span className="text-ink-200" style={{ paddingLeft: `${line.indent * 20}px` }}>
                  <CodeLine text={line.text} />
                </span>
              </div>
            ))}
            {phase === 'code' && visibleCodeLines < CODE_LINES.length && (
              <div className="flex items-center">
                <span className="mr-4 w-6 text-right text-ink-600 select-none">{visibleCodeLines + 1}</span>
                <span className="inline-block h-4 w-px animate-pulse bg-brand-400" />
              </div>
            )}
            {visibleCodeLines === CODE_LINES.length && (
              <div className="mt-3 flex items-center gap-2 text-xs text-brand-300 animate-fade-in">
                <Sparkles className="h-3.5 w-3.5" />
                AI Mentor: "This component uses useState to track tasks. Each task
                has a unique ID so React can update them efficiently."
              </div>
            )}
          </div>
        ) : (
          <AppPreview phase={phase} />
        )}
      </div>
    </div>
  );
}

function CodeLine({ text }: { text: string }) {
  // Simple syntax highlighting
  const keywords = ['function', 'const', 'return', 'useState'];
  const parts = text.split(/(\s+|[(){}[\];,])/);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return (
            <span key={i} className="text-brand-400">{part}</span>
          );
        }
        if (part.startsWith("'") || part.startsWith('"')) {
          return <span key={i} className="text-accent-300">{part}</span>;
        }
        if (/^[A-Z]/.test(part)) {
          return <span key={i} className="text-ocean-300">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function AppPreview({ phase }: { phase: string }) {
  return (
    <div className={`mx-auto max-w-sm rounded-2xl border border-white/10 bg-white p-5 shadow-xl transition-all duration-500 ${phase === 'app' || phase === 'done' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-gray-900">My Homework</h3>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {APP_TASKS.filter((t) => t.done).length}/{APP_TASKS.length} done
        </span>
      </div>
      <div className="space-y-2">
        {APP_TASKS.map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${task.done ? 'border-brand-200 bg-brand-50' : 'border-gray-200 bg-gray-50'}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${task.done ? 'bg-brand-500' : 'border-2 border-gray-300'}`}
            >
              {task.done && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
        + Add Task
      </button>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
        <span>Built with</span>
        <span className="font-semibold text-brand-600">YouCanBuildIt</span>
      </div>
    </div>
  );
}
