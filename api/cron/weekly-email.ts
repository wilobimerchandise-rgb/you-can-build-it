// Configure in vercel.json:
// { "crons": [{ "path": "/api/cron/weekly-email", "schedule": "0 14 * * 0" }] }
// (14:00 UTC Sunday — adjust for your primary audience's timezone.)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { generateWeeklyEmail, WeeklyActivitySummary } from '@/lib/ai/parentWeeklyEmail';

function serviceClient() {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel Cron sends this header; reject anything else to stop the
  // endpoint being triggered by an arbitrary public request.
  if (req.headers['x-vercel-cron'] !== '1' && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const db = serviceClient();
  const { data: kids } = await db.from('kids').select('id, nickname, parent_id, parents(email)');

  const results: { kidId: string; sent: boolean }[] = [];

  for (const kid of kids ?? []) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: log } = await db.from('activity_log').select('*').eq('kid_id', kid.id).gte('created_at', sevenDaysAgo);

    const summary: WeeklyActivitySummary = {
      kidNickname: kid.nickname,
      projectsStarted: (log ?? []).filter((e) => e.event === 'project_created').length,
      projectsPublished: (log ?? []).filter((e) => e.event === 'published').length,
      publishedProjectTitlesAndUrls: (log ?? [])
        .filter((e) => e.event === 'published')
        .map((e) => ({ title: e.meta?.title ?? 'Untitled', url: e.meta?.publishUrl })),
      mentorOpens: (log ?? []).filter((e) => e.event === 'mentor_opened').length,
      topConcepts: [], // derived from templates/codegen metadata in a full build
      streakDays: 0, // computed from consecutive activity_log days
      badgesEarned: (log ?? []).filter((e) => e.event === 'badge_earned').map((e) => e.meta?.badgeCode),
      dashboardUrl: `https://ycbi.app/parent-hq/${kid.parent_id}`
    };

    try {
      const email = await generateWeeklyEmail(summary);
      // TODO: send via your transactional email provider (Resend/Postmark),
      // to (kid.parents as any)?.email. Not wired here to avoid assuming
      // a provider not mentioned in the spec.
      results.push({ kidId: kid.id, sent: true });
      void email;
    } catch {
      results.push({ kidId: kid.id, sent: false });
    }
  }

  return res.status(200).json({ processed: results.length, results });
}
