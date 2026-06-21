import { describe, it, expect } from "vitest";
import { calculatePlatformFee, TIER_FEES, type Tier } from "./platformFees";

const TIERS: Tier[] = ["free", "starter", "pro", "enterprise"];

describe("TIER_FEES table", () => {
  it("covers all four documented tiers", () => {
    expect(Object.keys(TIER_FEES).sort()).toEqual(
      ["enterprise", "free", "pro", "starter"],
    );
  });

  it("keeps the published minimum at £5 for every tier", () => {
    for (const tier of TIERS) {
      expect(TIER_FEES[tier].min).toBe(500);
    }
  });

  it("decreases the rate as the tier increases", () => {
    const rates = TIERS.map((t) => TIER_FEES[t].rate);
    for (let i = 1; i < rates.length; i++) {
      expect(rates[i]).toBeLessThan(rates[i - 1]);
    }
  });

  it("keeps min below max for every tier", () => {
    for (const tier of TIERS) {
      expect(TIER_FEES[tier].min).toBeLessThan(TIER_FEES[tier].max);
    }
  });
});

describe("calculatePlatformFee", () => {
  describe("happy path — within band", () => {
    it("returns 2.5% of amount on free tier", () => {
      // £1,000 → 2.5% = £25 → 2500p
      expect(calculatePlatformFee(100_000, "free")).toBe(2500);
    });

    it("returns 2.0% on starter", () => {
      expect(calculatePlatformFee(100_000, "starter")).toBe(2000);
    });

    it("returns 1.5% on pro", () => {
      expect(calculatePlatformFee(100_000, "pro")).toBe(1500);
    });

    it("returns 1.0% on enterprise", () => {
      expect(calculatePlatformFee(100_000, "enterprise")).toBe(1000);
    });

    it("rounds to the nearest penny (no fractional pence)", () => {
      // 33333 * 0.025 = 833.325 → should round to 833 (banker's rounding via Math.round → 833)
      expect(calculatePlatformFee(33_333, "free")).toBe(833);
    });
  });

  describe("floor enforcement — small amounts hit the £5 minimum", () => {
    it("applies £5 minimum on free for amounts where 2.5% < £5", () => {
      // 1000p → 2.5% = 25p → floor to 500p
      expect(calculatePlatformFee(1000, "free")).toBe(500);
    });

    it("applies £5 minimum on enterprise for amounts where 1% < £5", () => {
      // 1000p → 1% = 10p → floor to 500p
      expect(calculatePlatformFee(1000, "enterprise")).toBe(500);
    });

    it("does not apply floor for amounts whose calculated fee already exceeds £5", () => {
      // 50000p → 2.5% = 1250p (above 500) → 1250
      expect(calculatePlatformFee(50_000, "free")).toBe(1250);
    });
  });

  describe("ceiling enforcement — large amounts hit tier maximums", () => {
    it("caps free tier at £100 (10000p)", () => {
      // 10,000,000p at 2.5% would be 250,000p → cap to 10000
      expect(calculatePlatformFee(10_000_000, "free")).toBe(10_000);
    });

    it("caps starter at £75", () => {
      expect(calculatePlatformFee(10_000_000, "starter")).toBe(7_500);
    });

    it("caps pro at £50", () => {
      expect(calculatePlatformFee(10_000_000, "pro")).toBe(5_000);
    });

    it("caps enterprise at £25", () => {
      expect(calculatePlatformFee(10_000_000, "enterprise")).toBe(2_500);
    });
  });

  describe("boundary conditions", () => {
    it("returns the floor for amount = 0", () => {
      expect(calculatePlatformFee(0, "free")).toBe(500);
    });

    it("returns the floor for negative amounts (defensive)", () => {
      // Negative input should not produce a negative fee. The implementation
      // uses Math.max on min, so a negative calculated fee clamps to the floor.
      expect(calculatePlatformFee(-1000, "free")).toBe(500);
    });

    it("handles fractional pence inputs without crashing", () => {
      // 123.45 * 0.025 = 3.08625 → rounds to 3
      expect(calculatePlatformFee(123.45, "free")).toBeGreaterThanOrEqual(500);
      expect(calculatePlatformFee(123.45, "free")).toBeLessThanOrEqual(10_000);
    });
  });
});