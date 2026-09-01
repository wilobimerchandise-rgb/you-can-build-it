import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateVibeCode } from '@/lib/ai/vibeModeCodegen';
import { verifyKidSessionToken } from '@/lib/kidSession';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-kid-session'] as string | undefined;
  const session = token ? verifyKidSessionToken(token) : null;
  if (!session) return res.status(401).json({ error: 'Invalid or expired kid session.' });

  const { confirmedPlan } = req.body ?? {};
  if (!confirmedPlan || confirmedPlan.type !== 'plan') {
    return res.status(400).json({ error: 'A confirmed plan is required.' });
  }

  try {
    const files = await generateVibeCode({ ageTrack: session.ageTrack as any, confirmedPlan });
    // TODO: persist files to projects.code_json and write a code_versions
    // snapshot row here (see schema.sql) before returning to the client.
    return res.status(200).json({ files });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
