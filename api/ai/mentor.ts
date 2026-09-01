import type { VercelRequest, VercelResponse } from '@vercel/node';
import { explainCode } from '@/lib/ai/aiMentorExplain';
import { verifyKidSessionToken } from '@/lib/kidSession';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-kid-session'] as string | undefined;
  const session = token ? verifyKidSessionToken(token) : null;
  if (!session) return res.status(401).json({ error: 'Invalid or expired kid session.' });

  if (session.ageTrack === '8-10') {
    // AI Mentor is not exposed to this track per the UI spec — reject
    // server-side too, don't rely on the client to hide the button.
    return res.status(403).json({ error: 'AI Mentor is not available for this age track.' });
  }

  const { selectedCode, surroundingFileContext, childQuestion } = req.body ?? {};
  if (!selectedCode) return res.status(400).json({ error: 'Missing selectedCode.' });

  try {
    const result = await explainCode({
      ageTrack: session.ageTrack as any,
      selectedCode,
      surroundingFileContext,
      childQuestion
    });
    // TODO: log activity_log event 'mentor_opened' here (drives the
    // weekly email's mentorOpens count and the badge engine).
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
