import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { moderateBeforePublish } from '@/lib/ai/publishModeration';
import { verifyKidSessionToken } from '@/lib/kidSession';
import { checkAndIncrementPublishRateLimit, publishLimitForPlan } from '@/lib/rateLimit';

const ADJECTIVES = ['purple', 'swift', 'brave', 'clever', 'sunny', 'quiet', 'bold', 'happy'];
const ANIMALS = ['panda', 'otter', 'falcon', 'fox', 'koala', 'lynx', 'wren', 'seal'];

function randomSlug(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${a}-${n}-${num}`;
}

function serviceClient() {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers['x-kid-session'] as string | undefined;
  const session = token ? verifyKidSessionToken(token) : null;
  if (!session) return res.status(401).json({ error: 'Invalid or expired kid session.' });

  const { projectId } = req.body ?? {};
  if (!projectId) return res.status(400).json({ error: 'Missing projectId.' });

  const db = serviceClient();

  const { data: parent } = await db.from('parents').select('plan').eq('id', session.parentId).single();
  const limit = publishLimitForPlan((parent?.plan as any) ?? 'free');
  const rate = await checkAndIncrementPublishRateLimit(session.kidId, limit);
  if (!rate.allowed) {
    return res.status(429).json({ error: `Publish limit reached (${limit}/hour on your plan).` });
  }

  const { data: project } = await db.from('projects').select('*').eq('id', projectId).single();
  if (!project || project.kid_id !== session.kidId) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const { count: priorPublishCount } = await db
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('kid_id', session.kidId)
    .eq('status', 'published');

  const files = (project.code_json ?? []) as { path: string; content: string }[];
  const publicFacingStrings = [project.title];

  try {
    const verdict = await moderateBeforePublish({
      ageTrack: session.ageTrack as any,
      files: files as any,
      publicFacingStrings,
      isFirstPublishForKid: (priorPublishCount ?? 0) === 0
    });

    if (verdict.verdict === 'block') {
      await db.from('projects').update({ status: 'blocked' }).eq('id', projectId);
      return res.status(422).json({ error: 'This project cannot be published.', reasons: verdict.reasons });
    }

    if (verdict.verdict === 'hold_for_human_review') {
      await db.from('projects').update({ status: 'held_for_review' }).eq('id', projectId);
      await db.from('moderation_queue').insert({ project_id: projectId, reasons: verdict.reasons });
      return res.status(202).json({ status: 'held_for_review' });
    }

    // verdict === 'approve' — mint a unique slug and record the publish.
    // TODO: replace this with an actual Vercel Deploy API call that
    // pushes `files` as a static build; this persists the record so the
    // rest of the flow (badges, activity log, Parent HQ) is real.
    let slug = randomSlug();
    let attempts = 0;
    while (attempts < 5) {
      const { data: clash } = await db.from('projects').select('id').eq('slug', slug).maybeSingle();
      if (!clash) break;
      slug = randomSlug();
      attempts += 1;
    }

    const publishUrl = `https://${slug}.ycbi.app`;
    await db
      .from('projects')
      .update({ status: 'published', slug, publish_url: publishUrl })
      .eq('id', projectId);

    await db.from('activity_log').insert({ kid_id: session.kidId, event: 'published', meta: { projectId, publishUrl } });

    return res.status(200).json({ status: 'published', publishUrl });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
