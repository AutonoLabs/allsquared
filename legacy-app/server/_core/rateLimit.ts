/**
 * Distributed rate limiter backed by Upstash Redis (REST).
 * Falls back to a process-local Map on dev / when Upstash is not configured.
 *
 * Use on Vercel serverless: each cold-start is a new instance, so the
 * previous in-memory Map approach was silently broken.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _limiter: Ratelimit | null = null;
let _redisOk = false;

function getLimiter(): Ratelimit | null {
  if (_limiter) return _limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  _limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "allsquared:rl",
  });
  _redisOk = true;
  return _limiter;
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

/**
 * Check (and consume) a rate-limit slot for `identifier` (e.g. IP or user id).
 * If Upstash is not configured, falls back to an in-memory Map.
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter();

  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  }

  // Dev fallback — process-local Map. NOT for production.
  return _memoryFallback(identifier);
}

// In-memory fallback
const _mem = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX = 100;

function _memoryFallback(identifier: string): RateLimitResult {
  const now = Date.now();
  const rec = _mem.get(identifier);
  if (!rec || now > rec.reset) {
    const reset = now + WINDOW_MS;
    _mem.set(identifier, { count: 1, reset });
    return { success: true, limit: MAX, remaining: MAX - 1, reset };
  }
  rec.count++;
  if (rec.count > MAX) {
    return { success: false, limit: MAX, remaining: 0, reset: rec.reset };
  }
  return { success: true, limit: MAX, remaining: MAX - rec.count, reset: rec.reset };
}

export const isDistributedRateLimitEnabled = (): boolean => _redisOk;
