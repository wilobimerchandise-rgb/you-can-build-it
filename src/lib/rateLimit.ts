// SERVER-SIDE ONLY. Vercel functions are stateless/ephemeral, so an
// in-memory rate limit resets on every cold start and is useless.
// This uses a small Postgres table as the shared counter instead.
// Run this once: create table publish_rate_limit (
//   kid_id uuid primary key, window_start timestamptz not null,
//   count int not null default 0 );

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function serviceClient(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
}

export async function checkAndIncrementPublishRateLimit(
  kidId: string,
  limitPerHour: number
): Promise<{ allowed: boolean; remaining: number }> {
  const db = serviceClient();
  const now = new Date();

  const { data: existing } = await db.from('publish_rate_limit').select('*').eq('kid_id', kidId).maybeSingle();

  if (!existing || now.getTime() - new Date(existing.window_start).getTime() > WINDOW_MS) {
    await db
      .from('publish_rate_limit')
      .upsert({ kid_id: kidId, window_start: now.toISOString(), count: 1 });
    return { allowed: true, remaining: limitPerHour - 1 };
  }

  if (existing.count >= limitPerHour) {
    return { allowed: false, remaining: 0 };
  }

  await db
    .from('publish_rate_limit')
    .update({ count: existing.count + 1 })
    .eq('kid_id', kidId);

  return { allowed: true, remaining: limitPerHour - (existing.count + 1) };
}

export function publishLimitForPlan(planTier: 'free' | 'family' | 'school'): number {
  return planTier === 'free' ? 3 : 20;
}
