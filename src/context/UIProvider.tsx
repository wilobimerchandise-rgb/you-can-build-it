import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, Mail, Lock, Rocket, ArrowRight } from 'lucide-react';

type ToastType = 'success' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

type AuthMode = 'signin' | 'signup';

interface UIContextValue {
  toast: (message: string, type?: ToastType) => void;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

export const UIContext = createContext<UIContextValue | null>(null);

let toastId = 0;

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const openAuth = useCallback((mode: AuthMode = 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setEmail('');
    setPassword('');
    setSubmitting(false);
  }, []);

  const handleAuthSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setTimeout(() => {
        closeAuth();
        toast(
          authMode === 'signup'
            ? "Account created! Check your email to verify and start building."
            : "Welcome back! Redirecting to your dashboard..."
        );
      }, 800);
    },
    [authMode, closeAuth, toast],
  );

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [authOpen, closeAuth]);

  return (
    <UIContext.Provider value={{ toast, openAuth, closeAuth }}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl animate-fade-in-up"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-400" />
            ) : (
              <Info className="h-5 w-5 flex-shrink-0 text-ocean-400" />
            )}
            <span className="text-sm font-medium text-white">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Auth modal */}
      {authOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in"
          onClick={closeAuth}
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/10 p-6 pb-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/15 blur-[80px]" />
              <button
                onClick={closeAuth}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-ocean-500 shadow-lg shadow-brand-500/30">
                  <Rocket className="h-6 w-6 text-ink-950" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {authMode === 'signup' ? 'Start Building Free' : 'Welcome Back'}
                  </h3>
                  <p className="text-sm text-ink-400">
                    {authMode === 'signup'
                      ? 'No credit card required. Free forever.'
                      : 'Sign in to your YouCanBuildIt account.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleAuthSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 transition-colors focus-within:border-brand-400/40">
                  <Mail className="h-5 w-5 flex-shrink-0 text-ink-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder-ink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 transition-colors focus-within:border-brand-400/40">
                  <Lock className="h-5 w-5 flex-shrink-0 text-ink-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent text-sm text-white placeholder-ink-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-400 py-3 text-sm font-semibold text-ink-950 transition-all hover:bg-brand-300 hover:shadow-lg hover:shadow-brand-400/30 active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
                ) : (
                  <>
                    {authMode === 'signup' ? 'Create My Account' : 'Sign In'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-ink-400">
                {authMode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New to YouCanBuildIt?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
                    >
                      Create a free account
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}
