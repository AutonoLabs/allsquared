import { TRPCError } from '@trpc/server';
import type { Contract } from '../../drizzle/schema';

export function isContractParty(contract: Pick<Contract, 'clientId' | 'providerId'>, userId: string): boolean {
  return contract.clientId === userId || contract.providerId === userId;
}

export function assertContractParty(
  contract: Pick<Contract, 'clientId' | 'providerId'>,
  userId: string,
  message = 'Unauthorized'
): void {
  if (!isContractParty(contract, userId)) {
    throw new TRPCError({ code: 'FORBIDDEN', message });
  }
}

export function assertContractClient(contract: Pick<Contract, 'clientId'>, userId: string): void {
  if (contract.clientId !== userId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the contract client can perform this action' });
  }
}

/** Draft updates allowed only while contract is still a draft. */
export function assertDraftEditable(contract: Pick<Contract, 'status' | 'clientId' | 'providerId'>, userId: string): void {
  assertContractParty(contract, userId);
  if (contract.status !== 'draft') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only draft contracts can be edited' });
  }
}
