import { describe, expect, it } from "vitest";
import {
  assertContractStatusTransition,
  canTransitionContractStatus,
} from "./contract-state";

describe("contract status transitions", () => {
  it("allows the expected signing flow", () => {
    expect(canTransitionContractStatus("draft", "pending_signature")).toBe(true);
    expect(canTransitionContractStatus("pending_signature", "active")).toBe(true);
    expect(canTransitionContractStatus("active", "completed")).toBe(true);
  });

  it("blocks invalid backwards and terminal transitions", () => {
    expect(canTransitionContractStatus("completed", "active")).toBe(false);
    expect(canTransitionContractStatus("cancelled", "draft")).toBe(false);
    expect(() => assertContractStatusTransition("draft", "completed")).toThrow(
      /Invalid contract status transition/
    );
  });
});

