import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { FixedWindowRateLimiter } from "./rate-limit";

describe("FixedWindowRateLimiter", () => {
  it("allows requests until the configured limit", () => {
    const limiter = new FixedWindowRateLimiter();

    limiter.assertAllowed("user-a", { limit: 2, windowMs: 1000, now: 0 });
    limiter.assertAllowed("user-a", { limit: 2, windowMs: 1000, now: 10 });

    expect(limiter.size()).toBe(1);
  });

  it("rejects excess requests and allows again after reset", () => {
    const limiter = new FixedWindowRateLimiter();

    limiter.assertAllowed("user-a", { limit: 1, windowMs: 1000, now: 0 });

    expect(() =>
      limiter.assertAllowed("user-a", { limit: 1, windowMs: 1000, now: 10 })
    ).toThrow(TRPCError);

    limiter.assertAllowed("user-a", { limit: 1, windowMs: 1000, now: 1001 });
    expect(limiter.size()).toBe(1);
  });
});

