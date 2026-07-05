/**
 * Platform fee calculation.
 *
 * Pure, no I/O. Mirrors the table in server/routers/payments.ts so the
 * router file remains the source of truth for the actual schema, but this
 * module is testable in isolation.
 *
 * Amounts are in pence.
 */

export type Tier = "free" | "starter" | "pro" | "enterprise";

type TierFees = {
  rate: number; // 0.025 = 2.5%
  min: number; // floor in pence
  max: number; // ceiling in pence
};

export const TIER_FEES: Record<Tier, TierFees> = {
  free: { rate: 0.025, min: 500, max: 10000 }, // 2.5%, min £5, max £100
  starter: { rate: 0.02, min: 500, max: 7500 }, // 2.0%, min £5, max £75
  pro: { rate: 0.015, min: 500, max: 5000 }, // 1.5%, min £5, max £50
  enterprise: { rate: 0.01, min: 500, max: 2500 }, // 1.0%, min £5, max £25
};

export function calculatePlatformFee(amountPence: number, tier: Tier): number {
  const fees = TIER_FEES[tier];
  const calculated = Math.round(amountPence * fees.rate);
  return Math.max(fees.min, Math.min(fees.max, calculated));
}