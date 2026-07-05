// Thin re-export barrel for AllSquared financial helpers.
// Pure functions live in `platformFees.ts` and `escrowFees.ts` so they can be
// unit-tested in isolation without loading the full router module graph
// (Drizzle, Stripe, OpenAI, Express, tRPC). This barrel gives callers a
// single import surface when they want both helpers together.

export {
  TIER_FEES,
  calculatePlatformFee,
  type Tier,
} from "./platformFees";

export {
  ESCROW_FEE_RATE,
  ESCROW_MIN_FEE_PENCE,
  ESCROW_MAX_FEE_PENCE,
  calculateEscrowFee,
  mapTranspactStatus,
  type EscrowStatus,
} from "./escrowFees";