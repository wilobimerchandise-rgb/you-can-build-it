import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getAgeConfig } from '@/lib/ageConfig';
import type { VibePlan, GeneratedFile } from '@/types';

export default function VibeMode() {
  const kid = useAppStore((s) => s.kid);
  const token = useAppStore((s) => s.kidSessionToken);
  const cfg = getAgeConfig(kid?.ageTrack ?? '10-12');
  const [prompt, setPrompt] = useState('');
  const [phase, setPhase] = useState<'input' | 'planning' | 'plan-ready' | 'coding' | 'done'>('input');
  const [plan, setPlan] = useState<VibePlan | null>(null);
  const [files, setFiles] = useState<GeneratedFile[] | null>(null);
  const [error, setError] = useState('');

  async function requestPlan() {
    setPhase('planning');
    setError('');
    const res = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-kid-session': token ?? '' },
      body: JSON.stringify({ childPrompt: prompt })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setPhase('input');
      return;
    }
    if (data.type === 'redirect') {
      setError(data.redirectMessage);
      setPhase('input');
      return;
    }
    setPlan(data);
    setPhase('plan-ready');
  }

  async function confirmAndGenerate() {
    setPhase('coding');
    setError('');
    const res = await fetch('/api/ai/codegen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-kid-session': token ?? '' },
      body: JSON.stringify({ confirmedPlan: plan })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setPhase('plan-ready');
      return;
    }
    setFiles(data.files);
    setPhase('done');
  }

  return (
    <div className="min-h-screen bg-paper p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-2">What do you want to build?</h1>
      <p className="text-blueprint-700 mb-6">
        {cfg.inputMode === 'voice-first' ? 'Tap the mic, or tap one of the ideas below.' : 'Describe it in your own words.'}
      </p>

      {phase === 'input' && (
        <div className="space-y-4">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Build me a homework tracker…" className="w-full rounded-xl border border-blueprint-400 p-4 text-lg" />
          <div className="flex flex-wrap gap-2">
            {cfg.examplePrompts.map((p) => (
              <button key={p} onClick={() => setPrompt(p)} className="rounded-full bg-blueprint-100 px-4 py-2 text-sm">
                {p}
              </button>
            ))}
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button onClick={requestPlan} disabled={!prompt.trim()} className="rounded-lg bg-signal-orange text-white font-semibold px-6 py-3 disabled:opacity-40">
            Show me the plan
          </button>
        </div>
      )}

      {phase === 'planning' && <p className="animate-pulse text-blueprint-700">Sketching a plan…</p>}

      {phase === 'plan-ready' && plan && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-dashed border-blueprint-400 p-6">
            <h2 className="font-display text-xl mb-1">{plan.title}</h2>
            <p className="mb-4">{plan.summary}</p>
            <h3 className="font-semibold mb-1">Screens</h3>
            <ul className="list-disc list-inside mb-4">
              {plan.screens.map((s) => (
                <li key={s.name}>{s.name} — {s.purpose}</li>
              ))}
            </ul>
            <p className="text-sm text-blueprint-700">Estimated build time: {plan.estimatedBuildTimeMinutes} min</p>
          </div>
          <div className="flex gap-3">
            <button onClick={confirmAndGenerate} className="rounded-lg bg-signal-green text-blueprint-950 font-semibold px-6 py-3">
              Yes, build it! 🔨
            </button>
            <button onClick={() => setPhase('input')} className="rounded-lg border px-6 py-3">Change my idea</button>
          </div>
        </div>
      )}

      {phase === 'coding' && <p className="animate-pulse text-blueprint-700">Building your app…</p>}

      {phase === 'done' && files && (
        <div className="space-y-2">
          <p className="text-signal-green font-semibold text-lg">Your code is ready! 🎉</p>
          {cfg.showCodeByDefault ? (
            <p>Opening it in the editor next — Monaco + AI Mentor{cfg.showGitDiff ? ' + Git for Kids diff' : ''} are next.</p>
          ) : (
            <p>Tap "Peek at the code" from your project to see how it works, or publish it now!</p>
          )}
        </div>
      )}
    </div>
  );
}
