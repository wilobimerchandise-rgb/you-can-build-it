import { Link } from 'react-router-dom';
import { Hammer, Rocket, Award, BookOpen } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getAgeConfig } from '@/lib/ageConfig';

const ZONES = [
  { key: 'start', to: '/vibe', icon: Hammer, title: 'Start New Project', accent: 'bg-signal-orange' },
  { key: 'published', to: '/published', icon: Rocket, title: 'My Published Apps', accent: 'bg-blueprint-700' },
  { key: 'badges', to: '/badges', icon: Award, title: 'Badges', accent: 'bg-signal-yellow' },
  { key: 'learn', to: '/learn', icon: BookOpen, title: 'Learn', accent: 'bg-signal-green' }
] as const;

export default function Dashboard() {
  const kid = useAppStore((s) => s.kid);
  const cfg = getAgeConfig(kid?.ageTrack ?? '10-12');
  const isYoungest = kid?.ageTrack === '8-10';
  const isDark = cfg.theme === 'dark';

  return (
    <div className={isDark ? 'min-h-screen bg-blueprint-950 text-paper p-8' : 'min-h-screen bg-paper p-8'}>
      <header className="mb-8">
        <h1 className={isYoungest ? 'text-3xl' : 'text-2xl'}>
          {isYoungest ? `Hey ${kid?.nickname ?? 'builder'}! 👋` : `Welcome back, ${kid?.nickname ?? 'builder'}`}
        </h1>
        <p className={isDark ? 'text-blueprint-400 text-sm' : 'text-blueprint-700'}>
          {cfg.label} track — {isYoungest ? "let's build something!" : 'what are we shipping today?'}
        </p>
      </header>

      <div className={isYoungest ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-2 md:grid-cols-4 gap-4'}>
        {ZONES.map((zone) => (
          <Link
            key={zone.key}
            to={zone.to}
            style={{ minHeight: isYoungest ? cfg.tapTargetPx * 2 : undefined }}
            className={`${zone.accent} rounded-2xl p-6 text-white flex ${
              isYoungest ? 'flex-row items-center gap-4' : 'flex-col gap-3'
            } shadow-md hover:scale-[1.02] transition-transform`}
          >
            <zone.icon size={isYoungest ? 40 : 28} />
            <span className={isYoungest ? 'text-xl font-display' : 'font-display'}>{zone.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
