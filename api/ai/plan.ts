import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateVibePlan } from '@/lib/ai/vibeModePlan';
import { verifyKidSessionToken } from '@/lib/kidSession';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-kid-session'] as string | undefined;
  const session = token ? verifyKidSessionToken(token) : null;
  if (!session) return res.status(401).json({ error: 'Invalid or expired kid session.' });

  const { childPrompt, starterTemplate } = req.body ?? {};
  if (!childPrompt || typeof childPrompt !== 'string') {
    return res.status(400).json({ error: 'Missing childPrompt.' });
  }

  try {
    const result = await generateVibePlan({
      ageTrack: session.ageTrack as any,
      childPrompt,
      starterTemplate: starterTemplate ?? null
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
