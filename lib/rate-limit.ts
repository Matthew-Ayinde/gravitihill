/**
 * Simple in-memory fixed-window rate limit for the contact route.
 *
 * Scope: one process. On Vercel that means per lambda instance, which is
 * enough to stop a script hammering the form and is honestly all an in-memory
 * limiter can promise. If the form ever needs a real guarantee across
 * instances, swap this module for a Redis/Upstash counter — the call signature
 * is deliberately narrow so that is a one-file change.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export function rateLimit(key: string): {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }

  if (entry.count > MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return {
    ok: true,
    remaining: MAX_REQUESTS - entry.count,
    retryAfterSeconds: 0,
  };
}
