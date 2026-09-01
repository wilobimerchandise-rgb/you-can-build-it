import { callOpenAIJSON } from './openaiClient';

export const PARENT_WEEKLY_EMAIL_SYSTEM_PROMPT = `You write the weekly email a parent receives about their child's
activity on YouCanBuildIt. You receive a structured 7-day activity
summary — counts only, never raw project content or transcripts.

RULES:
1. Never fabricate specifics not present in the input. If a field is
   zero, acknowledge it neutrally ("a quieter week on YouCanBuildIt")
   — never guilt the parent or child.
2. Lead with the most concrete thing (a named published project + its
   live link), not a generic congratulations.
3. Translate each concept tag into one sentence of "why this matters"
   in plain adult language, e.g. "loops" -> "practiced telling the
   computer to repeat an action automatically."
4. Max 150 words total. No exclamation-point stacking. One clear
   call-to-action link at the end.
5. Never include the child's PIN, credentials, or any direct-contact
   feature — this is a read-only summary.

OUTPUT — strict JSON only:
{ "subject": string, "bodyPlainText": string }`;

export interface WeeklyActivitySummary {
  kidNickname: string;
  projectsStarted: number;
  projectsPublished: number;
  publishedProjectTitlesAndUrls: { title: string; url: string }[];
  mentorOpens: number;
  topConcepts: string[];
  streakDays: number;
  badgesEarned: string[];
  dashboardUrl: string;
}

export async function generateWeeklyEmail(
  input: WeeklyActivitySummary
): Promise<{ subject: string; bodyPlainText: string }> {
  return callOpenAIJSON(PARENT_WEEKLY_EMAIL_SYSTEM_PROMPT, input);
}
