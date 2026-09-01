// SERVER-SIDE ONLY (imported by /api routes). A kid signs in with a PIN,
// not a Supabase Auth session — so RLS policies keyed to auth.uid()
// cannot apply directly to kid-authored requests. This module mints a
// short-lived, signed token scoped to exactly one kid_id after PIN
// verification, and every /api route that touches kid data verifies it
// before running any query with the service-role client.
//
// This is the fix for the gap flagged in review: "kids can only see
// their own parent's data" is not enforceable as plain RLS when kids
// aren't auth.users rows.

import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_SECRET = process.env.KID_SESSION_SECRET;
const SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 hours

interface KidSessionPayload {
  kidId: string;
  parentId: string;
  ageTrack: string;
  exp: number;
}

function requireSecret(): string {
  if (!SESSION_SECRET) throw new Error('KID_SESSION_SECRET is not set on the server.');
  return SESSION_SECRET;
}

function sign(payload: string): string {
  return createHmac('sha256', requireSecret()).update(payload).digest('base64url');
}

export function issueKidSessionToken(payload: Omit<KidSessionPayload, 'exp'>): string {
  const body: KidSessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyKidSessionToken(token: string): KidSessionPayload | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as KidSessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
