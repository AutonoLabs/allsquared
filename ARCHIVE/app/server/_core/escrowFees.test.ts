import { describe, it, expect } from "vitest";
import {
  calculateEscrowFee,
  mapTranspactStatus,
  ESCROW_FEE_RATE,
  ESCROW_MIN_FEE_PENCE,
  ESCROW_MAX_FEE_PENCE,
} from "./escrowFees";

describe("calculateEscrowFee", () => {
  it("returns 2% of the amount in the normal band", () => {
    // £1,000 → 2% = £20 → 2000p
    expect(calculateEscrowFee(100_000)).toBe(2000);
  });

  it("enforces the £5 minimum for small amounts", () => {
    // 1000p → 2% = 20p → floor to 500p
    expect(calculateEscrowFee(1000)).toBe(500);
  });

  it("enforces the £250 maximum for large amounts", () => {
    // 10,000,000p at 2% would be 200,000p → cap to 25,000p
    expect(calculateEscrowFee(10_000_000)).toBe(25_000);
  });

  it("matches the floor exactly at the boundary", () => {
    // Where 2% equals £5: 25,000p → 500p (no clamp)
    expect(calculateEscrowFee(25_000)).toBe(500);
  });

  it("matches the ceiling exactly at the boundary", () => {
    // Where 2% equals £250: 1,250,000p → 25,000p (no clamp)
    expect(calculateEscrowFee(1_250_000)).toBe(25_000);
  });

  it("returns the floor for amount = 0", () => {
    expect(calculateEscrowFee(0)).toBe(ESCROW_MIN_FEE_PENCE);
  });

  it("returns the floor for negative amounts (defensive)", () => {
    expect(calculateEscrowFee(-1000)).toBe(ESCROW_MIN_FEE_PENCE);
  });

  it("rounds to the nearest penny", () => {
    // 33333 * 0.02 = 666.66 → rounds to 667
    expect(calculateEscrowFee(33_333)).toBe(667);
  });

  it("exposes a sane published schedule", () => {
    expect(ESCROW_FEE_RATE).toBeGreaterThan(0);
    expect(ESCROW_FEE_RATE).toBeLessThan(1);
    expect(ESCROW_MIN_FEE_PENCE).toBeLessThan(ESCROW_MAX_FEE_PENCE);
  });
});

describe("mapTranspactStatus", () => {
  it("maps 'created' to pending", () => {
    expect(mapTranspactStatus("created")).toBe("pending");
  });

  it("maps 'awaiting_deposit' to pending", () => {
    expect(mapTranspactStatus("awaiting_deposit")).toBe("pending");
  });

  it("maps 'deposited' to held", () => {
    expect(mapTranspactStatus("deposited")).toBe("held");
  });

  it("maps 'held' to held", () => {
    expect(mapTranspactStatus("held")).toBe("held");
  });

  it("maps 'released' to released", () => {
    expect(mapTranspactStatus("released")).toBe("released");
  });

  it("maps 'refunded' to refunded", () => {
    expect(mapTranspactStatus("refunded")).toBe("refunded");
  });

  it("maps 'cancelled' to cancelled", () => {
    expect(mapTranspactStatus("cancelled")).toBe("cancelled");
  });

  it("maps 'expired' to cancelled (terminal-but-not-released)", () => {
    expect(mapTranspactStatus("expired")).toBe("cancelled");
  });

  it("is case-insensitive", () => {
    expect(mapTranspactStatus("HELD")).toBe("held");
    expect(mapTranspactStatus("Released")).toBe("released");
    expect(mapTranspactStatus("EXPIRED")).toBe("cancelled");
  });

  it("falls back to 'pending' for unknown values (safe default)", () => {
    expect(mapTranspactStatus("some_future_state")).toBe("pending");
    expect(mapTranspactStatus("")).toBe("pending");
  });
});