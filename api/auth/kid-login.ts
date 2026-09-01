import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { issueKidSessionToken } from '@/lib/kidSession';

function serviceClient() {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { kidId, pin } = req.body ?? {};
  if (!kidId || !pin) return res.status(400).json({ error: 'Missing kidId or pin.' });

  const db = serviceClient();
  const { data: kid } = await db.from('kids').select('*').eq('id', kidId).single();
  if (!kid) return res.status(404).json({ error: 'Builder not found.' });

  const pinHash = createHash('sha256').update(pin).digest('hex');
  if (pinHash !== kid.pin_hash) {
    // Deliberately generic message — don't reveal whether the kidId or
    // the PIN was the wrong part.
    return res.status(401).json({ error: 'Incorrect PIN.' });
  }

  const token = issueKidSessionToken({ kidId: kid.id, parentId: kid.parent_id, ageTrack: kid.age_track });
  return res.status(200).json({
    token,
    kid: { id: kid.id, nickname: kid.nickname, ageTrack: kid.age_track }
  });
}
