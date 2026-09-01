export type AgeTrack = '8-10' | '10-12' | '12-14' | '14-16';

export type PlanTier = 'free' | 'family' | 'school';

export interface Parent {
  id: string;
  authUserId: string;
  email: string;
  planTier: PlanTier;
  consentAt: string;
}

export interface Kid {
  id: string;
  parentId: string;
  nickname: string;
  birthYear: number;
  ageTrack: AgeTrack;
}

export type ProjectStatus = 'draft' | 'building' | 'published' | 'held_for_review' | 'blocked';

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
}

export interface Project {
  id: string;
  kidId: string;
  title: string;
  slug: string;
  templateId: string | null;
  status: ProjectStatus;
  codeJson: GeneratedFile[] | null;
  publishUrl: string | null;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  ageTracks: AgeTrack[];
  problem: string;
  starterPrompt: string;
}

// ── AI module contracts ──────────────────────────────────────────────

export interface PlanScreen {
  name: string;
  purpose: string;
}

export interface PlanDataModelField {
  name: string;
  type: string;
}

export interface PlanDataModelTable {
  table: string;
  fields: PlanDataModelField[];
}

export interface VibePlan {
  type: 'plan';
  title: string;
  summary: string;
  screens: PlanScreen[];
  dataModel: PlanDataModelTable[];
  keyInteraction: string;
  stretchIdea: string;
  estimatedBuildTimeMinutes: number;
}

export interface VibeRedirect {
  type: 'redirect';
  redirectMessage: string;
}

export type VibePlanResult = VibePlan | VibeRedirect;

export interface MentorExplainResult {
  explanation: string;
  termIntroduced: string | null;
  needsReview: boolean;
  suggestedFollowupQuestion: string | null;
}

export interface ModerationVerdict {
  verdict: 'approve' | 'hold_for_human_review' | 'block';
  reasons: string[];
  publicFacingTextFlags: { text: string; issue: string }[];
}
