import { useReveal } from '@/hooks/useReveal';
import { Table } from 'lucide-react';

type CellValue = string;

interface SpecRow {
  dimension: string;
  builders: CellValue;
  makers: CellValue;
  coders: CellValue;
  engineers: CellValue;
}

const ROWS: SpecRow[] = [
  {
    dimension: 'Input mode',
    builders: 'Voice-first + tap-to-pick',
    makers: 'Voice or type',
    coders: 'Type',
    engineers: 'Type, keyboard-shortcut-first',
  },
  {
    dimension: 'Code visibility',
    builders: 'Hidden by default; "Peek at code" optional',
    makers: 'Split screen: blocks (left) mapped to real code (right)',
    coders: 'Code-first, blocks removed, dark mode',
    engineers: 'Full IDE: file tree, terminal log, Git-style commit history',
  },
  {
    dimension: 'Editor',
    builders: 'None (guided cards only)',
    makers: 'Simplified Monaco (read + light edit, big font)',
    coders: 'Full Monaco, dark theme',
    engineers: 'Full Monaco + command palette',
  },
  {
    dimension: 'Color & density',
    builders: 'High contrast, 56px+ tap targets, heavy illustration',
    makers: 'Colorful but denser, gamified progress bar',
    coders: 'Muted "workshop" palette, subtle badges',
    engineers: 'Neutral pro theme, badges become a changelog',
  },
  {
    dimension: 'AI Mentor tone',
    builders: 'Playful analogy-first ("like a locker for your stuff")',
    makers: 'Analogy + first correct term ("this is called a variable")',
    coders: 'Correct terminology, brief, links to a "why"',
    engineers: 'Terse, technical, links to real docs (MDN, Supabase)',
  },
  {
    dimension: 'Publish flow',
    builders: '1 tap, adult-in-the-loop share only',
    makers: '1 tap, family-link default, public needs parent approval',
    coders: '1 tap, public-link with content warning modal',
    engineers: 'Full deploy log visible, can view build output',
  },
];

const COLUMNS = [
  { id: 'builders' as const, label: '8-10', sublabel: 'Builders', color: 'text-accent-400', border: 'border-accent-400/20', bg: 'bg-accent-400/5' },
  { id: 'makers' as const, label: '10-12', sublabel: 'Makers', color: 'text-brand-400', border: 'border-brand-400/20', bg: 'bg-brand-400/5' },
  { id: 'coders' as const, label: '12-14', sublabel: 'Coders', color: 'text-ocean-400', border: 'border-ocean-400/20', bg: 'bg-ocean-400/5' },
  { id: 'engineers' as const, label: '14-16', sublabel: 'Engineers', color: 'text-ink-200', border: 'border-ink-300/20', bg: 'bg-ink-300/5' },
];

export default function UISpec() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="ui-spec" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/50 to-transparent" />

      <div ref={ref} className={`container-ycbi relative z-10 reveal ${visible ? 'is-visible' : ''}`}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-label">
            <Table className="h-3.5 w-3.5" />
            UI Specification
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            One product, four radically different interfaces
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Same information architecture across all age tracks — but the input mode,
            code visibility, editor, and even the AI's tone shift to match each kid's
            developmental stage.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="w-48 p-5 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Dimension
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.id} className={`p-5 text-center ${col.bg}`}>
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-display text-lg font-bold ${col.color}`}>{col.label}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{col.sublabel}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.dimension} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="p-5 text-sm font-semibold text-ink-200">
                    {row.dimension}
                  </td>
                  {COLUMNS.map((col) => (
                    <td key={col.id} className="p-5 text-center text-sm text-ink-300">
                      {row[col.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 lg:hidden">
          {COLUMNS.map((col) => (
            <div key={col.id} className="glass-card overflow-hidden">
              <div className={`flex items-center gap-3 border-b border-white/10 p-4 ${col.bg}`}>
                <span className={`font-display text-xl font-bold ${col.color}`}>{col.label}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">{col.sublabel}</span>
              </div>
              <div className="divide-y divide-white/5">
                {ROWS.map((row) => (
                  <div key={row.dimension} className="p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      {row.dimension}
                    </p>
                    <p className="text-sm text-ink-200">{row[col.id]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
