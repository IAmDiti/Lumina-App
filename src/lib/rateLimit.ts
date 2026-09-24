import "server-only";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * In-memory fixed-window rate limiter keyed by an arbitrary string (e.g. an
 * IP). Per-process only: it resets on redeploy/restart and isn't shared
 * across multiple instances, so it's a pragmatic first line of defense for a
 * low-traffic anonymous endpoint, not a hard guarantee. Swap for a shared
 * store (e.g. Upstash Redis) if abuse becomes a real problem.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
