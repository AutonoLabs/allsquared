import { TRPCError } from "@trpc/server";

export const CONTRACT_STATUSES = [
  "draft",
  "pending_signature",
  "active",
  "completed",
  "cancelled",
  "disputed",
] as const;

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

const allowedTransitions: Record<ContractStatus, readonly ContractStatus[]> = {
  draft: ["pending_signature", "cancelled"],
  pending_signature: ["active", "cancelled", "disputed"],
  active: ["completed", "disputed", "cancelled"],
  disputed: ["active", "completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function isContractStatus(value: string): value is ContractStatus {
  return (CONTRACT_STATUSES as readonly string[]).includes(value);
}

export function canTransitionContractStatus(
  current: ContractStatus,
  next: ContractStatus
): boolean {
  if (current === next) return true;
  return allowedTransitions[current].includes(next);
}

export function assertContractStatusTransition(
  current: ContractStatus,
  next: ContractStatus
): void {
  if (!canTransitionContractStatus(current, next)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid contract status transition from ${current} to ${next}`,
    });
  }
}

