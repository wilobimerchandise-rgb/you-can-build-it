import type { AgeTrack } from '@/types';

export interface AgeUiConfig {
  label: string;
  inputMode: 'voice-first' | 'voice-or-type' | 'type';
  showCodeByDefault: boolean;
  splitScreen: boolean;
  showMonaco: boolean;
  showGitDiff: boolean; // "Git for Kids" diff view, 12-14+
  ideLayout: boolean; // file tree + terminal log, 14-16 only
  tapTargetPx: number;
  theme: 'light' | 'dark';
  examplePrompts: string[];
  publishVisibilityDefault: 'family-only' | 'public';
  requiresCommentsInCode: boolean;
}

export const AGE_TRACKS: AgeTrack[] = ['8-10', '10-12', '12-14', '14-16'];

export const ageConfig: Record<AgeTrack, AgeUiConfig> = {
  '8-10': {
    label: 'Builders',
    inputMode: 'voice-first',
    showCodeByDefault: false,
    splitScreen: false,
    showMonaco: false,
    showGitDiff: false,
    ideLayout: false,
    tapTargetPx: 56,
    theme: 'light',
    examplePrompts: ['A chore chart with stars ⭐', 'A pet feeding reminder 🐹', 'A book log 📚'],
    publishVisibilityDefault: 'family-only',
    requiresCommentsInCode: false
  },
  '10-12': {
    label: 'Makers',
    inputMode: 'voice-or-type',
    showCodeByDefault: true,
    splitScreen: true, // left: visual blocks, right: read-only code, highlighted
    showMonaco: true,
    showGitDiff: false,
    ideLayout: false,
    tapTargetPx: 44,
    theme: 'light',
    examplePrompts: ['A homework tracker with due dates', 'A weekly screen-time budget'],
    publishVisibilityDefault: 'family-only',
    requiresCommentsInCode: true // comments required per spec section 3
  },
  '12-14': {
    label: 'Coders',
    inputMode: 'type',
    showCodeByDefault: true,
    splitScreen: false,
    showMonaco: true,
    showGitDiff: true, // "Git for Kids" diff after AI generation
    ideLayout: false,
    tapTargetPx: 40,
    theme: 'dark',
    examplePrompts: ['A Pomodoro timer with study analytics', 'A habit streak dashboard'],
    publishVisibilityDefault: 'public',
    requiresCommentsInCode: false
  },
  '14-16': {
    label: 'Engineers',
    inputMode: 'type',
    showCodeByDefault: true,
    splitScreen: false,
    showMonaco: true,
    showGitDiff: true,
    ideLayout: true, // file tree + terminal-style deploy log
    tapTargetPx: 36,
    theme: 'dark',
    examplePrompts: ['A Kanban tracker for internship applications', 'A savings-goal projection dashboard'],
    publishVisibilityDefault: 'public',
    requiresCommentsInCode: false
  }
};

export function getAgeConfig(track: AgeTrack): AgeUiConfig {
  return ageConfig[track];
}
