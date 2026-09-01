import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import type { AgeTrack } from '@/types';

function trackFromBirthYear(birthYear: number): AgeTrack {
  const age = new Date().getFullYear() - birthYear;
  if (age <= 10) return '8-10';
  if (age <= 12) return '10-12';
  if (age <= 14) return '12-14';
  return '14-16';
}

const STEPS = ['parent-account', 'child-profile', 'consent', 'child-pin'] as const;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [parentEmail, setParentEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const ageTrack = birthYear ? trackFromBirthYear(Number(birthYear)) : null;

  async function handleParentSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.auth.signInWithOtp({
      email: parentEmail,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` }
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('idle');
    setStep(1);
  }

  async function hashPin(rawPin: string): Promise<string> {
    // Client-side pre-hash only; api/auth/kid-login.ts is the source of
    // truth for verification and uses the same SHA-256 scheme server-side.
    const enc = new TextEncoder().encode(rawPin);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function handleCreateKidAndConsent() {
    setStatus('loading');
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus('error');
      setErrorMsg('Please verify your email first.');
      return;
    }

    const { data: parentRow, error: parentErr } = await supabase
      .from('parents')
      .upsert({ auth_user_id: user.id, email: parentEmail, consent_at: new Date().toISOString() })
      .select()
      .single();

    if (parentErr || !parentRow) {
      setStatus('error');
      setErrorMsg(parentErr?.message ?? 'Could not create parent record.');
      return;
    }

    const pinHash = await hashPin(pin);
    const { error: kidErr } = await supabase.from('kids').insert({
      parent_id: parentRow.id,
      nickname,
      birth_year: Number(birthYear),
      age_track: ageTrack,
      pin_hash: pinHash
    });

    if (kidErr) {
      setStatus('error');
      setErrorMsg(kidErr.message);
      return;
    }
    setStatus('done');
  }

  return (
    <div className="min-h-screen bg-blueprint-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-paper rounded-2xl shadow-xl max-w-md w-full p-8">
        <h1 className="text-2xl text-blueprint-900 mb-1">YouCanBuildIt</h1>
        <p className="text-sm text-blueprint-700 mb-6">Step {step + 1} of {STEPS.length}</p>

        {step === 0 && (
          <form onSubmit={handleParentSignup} className="space-y-4">
            <h2 className="font-display text-lg">Parent email first</h2>
            <p className="text-sm text-ink/70">
              We'll send a sign-in link. Only a verified parent account can create a child profile.
            </p>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full rounded-lg border border-blueprint-400 px-4 py-3"
            />
            <button type="submit" disabled={status === 'loading'} className="w-full rounded-lg bg-signal-orange text-white font-semibold py-3">
              {status === 'loading' ? 'Sending link…' : 'Send sign-in link'}
            </button>
            {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
          </form>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg">Tell us about your builder</h2>
            <input placeholder="Nickname (no last names)" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full rounded-lg border border-blueprint-400 px-4 py-3" />
            <input type="number" placeholder="Birth year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="w-full rounded-lg border border-blueprint-400 px-4 py-3" />
            {ageTrack && <p className="text-sm text-blueprint-700">Age track: <strong>{ageTrack}</strong></p>}
            <button onClick={() => setStep(2)} disabled={!nickname || !birthYear} className="w-full rounded-lg bg-signal-orange text-white font-semibold py-3 disabled:opacity-40">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg">Parental consent</h2>
            <div className="text-sm text-ink/80 bg-blueprint-100 rounded-lg p-4 space-y-2">
              <p>We collect only your child's nickname and birth year (to set their age track).</p>
              <p>Your child's typed or spoken project ideas and code are sent to an AI model to generate code suggestions.</p>
              <p>You can review, export, or delete your child's data anytime from Parent HQ.</p>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} className="mt-1" />
              I am this child's parent or legal guardian and I consent to the data practices above.
            </label>
            <button onClick={() => setStep(3)} disabled={!consentChecked} className="w-full rounded-lg bg-signal-orange text-white font-semibold py-3 disabled:opacity-40">
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg">Set a login PIN for {nickname || 'your builder'}</h2>
            <input type="password" inputMode="numeric" maxLength={6} placeholder="4–6 digit PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full rounded-lg border border-blueprint-400 px-4 py-3 tracking-widest text-center text-xl" />
            <button onClick={handleCreateKidAndConsent} disabled={pin.length < 4 || status === 'loading'} className="w-full rounded-lg bg-signal-green text-blueprint-950 font-semibold py-3 disabled:opacity-40">
              {status === 'loading' ? 'Creating profile…' : 'Create builder profile'}
            </button>
            {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
            {status === 'done' && <p className="text-signal-green font-semibold">All set! {nickname} can now sign in with their PIN.</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
