import { Rocket, Twitter, Github, Youtube, Instagram } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Age Tracks', href: '#age-tracks' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Templates', href: '#' },
  ],
  'For Parents': [
    { label: 'Parent HQ', href: '#parent-hq' },
    { label: 'Safety & Moderation', href: '#' },
    { label: 'COPPA Compliance', href: '#' },
    { label: 'Weekly Reports', href: '#' },
  ],
  'For Educators': [
    { label: 'School Plans', href: '#pricing' },
    { label: 'Teacher Dashboard', href: '#' },
    { label: 'Roster Import', href: '#' },
    { label: 'Curriculum Guides', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

const SOCIAL_ICONS = [Twitter, Github, Youtube, Instagram];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="container-ycbi py-16">
        <div className="grid gap-10 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#top" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-ocean-500 shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-110">
                <Rocket className="h-5 w-5 text-ink-950" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                YouCanBuildIt
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Where kids 8–16 turn a sentence into a real, published app in under
              15 minutes. The on-ramp to real engineering literacy.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-2">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-400 transition-all hover:border-brand-400/30 hover:text-brand-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-ink-500">
            &copy; 2026 YouCanBuildIt, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-ink-500 transition-colors hover:text-ink-300">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-ink-500 transition-colors hover:text-ink-300">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-ink-500 transition-colors hover:text-ink-300">
              COPPA Notice
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
