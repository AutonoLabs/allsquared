/**
 * Pure escrow helpers — testable without DB / SOAP client.
 *
 * Amounts are in pence. The fee schedule mirrors Transpact's published
 * 2% rate for AllSquared's account (subject to change — update here when
 * the partner agreement is renewed).
 */

export const ESCROW_FEE_RATE = 0.02; // 2%
export const ESCROW_MIN_FEE_PENCE = 500; // £5
export const ESCROW_MAX_FEE_PENCE = 25000; // £250

export function calculateEscrowFee(amountPence: number): number {
  const calculated = Math.round(amountPence * ESCROW_FEE_RATE);
  return Math.max(ESCROW_MIN_FEE_PENCE, Math.min(ESCROW_MAX_FEE_PENCE, calculated));
}

export type EscrowStatus = "pending" | "held" | "released" | "refunded" | "cancelled";

const STATUS_MAP: Record<string, EscrowStatus> = {
  created: "pending",
  awaiting_deposit: "pending",
  deposited: "held",
  held: "held",
  released: "released",
  refunded: "refunded",
  cancelled: "cancelled",
  expired: "cancelled",
};

/**
 * Map a Transpact status string to our internal escrow status enum.
 * Falls back to "pending" for unknown values (safer default than rejecting
 * the webhook — the dispute workflow can recover).
 */
export function mapTranspactStatus(transpactStatus: string): EscrowStatus {
  return STATUS_MAP[transpactStatus.toLowerCase()] ?? "pending";
}