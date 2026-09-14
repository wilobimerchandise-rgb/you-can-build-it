import { useEffect, useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { useUI } from '@/context/useUI';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Age Tracks', href: '#age-tracks' },
  { label: 'Flows', href: '#user-flows' },
  { label: 'Templates', href: '#templates' },
  { label: 'Playbook', href: '#playbook' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openAuth } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-ycbi flex h-16 items-center justify-between md:h-18">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-ocean-500 shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-110">
            <Rocket className="h-5 w-5 text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            YouCanBuildIt
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => openAuth('signin')} className="btn-ghost">
            Sign in
          </button>
          <button onClick={() => openAuth('signup')} className="btn-primary">
            Start Building Free
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl md:hidden">
          <div className="container-ycbi flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <button onClick={() => { setMobileOpen(false); openAuth('signin'); }} className="btn-ghost w-full">
                Sign in
              </button>
              <button onClick={() => { setMobileOpen(false); openAuth('signup'); }} className="btn-primary w-full">
                Start Building Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
