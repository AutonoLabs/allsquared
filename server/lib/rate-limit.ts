import { TRPCError } from "@trpc/server";

type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: number;
};

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  assertAllowed(key: string, options: RateLimitOptions): void {
    const now = options.now ?? Date.now();
    this.cleanup(now);

    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return;
    }

    if (existing.count >= options.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      });
    }

    existing.count += 1;
  }

  size(): number {
    return this.buckets.size;
  }

  cleanup(now = Date.now()): void {
    for (const [key, bucket] of Array.from(this.buckets.entries())) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}

export const aiRateLimiter = new FixedWindowRateLimiter();

export function assertAiRateLimit(userId: string): void {
  aiRateLimiter.assertAllowed(`ai:${userId}`, {
    limit: Number(process.env.AI_RATE_LIMIT_REQUESTS ?? 10),
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS ?? 60_000),
  });
}
