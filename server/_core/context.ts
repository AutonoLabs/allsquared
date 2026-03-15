import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { authenticateClerkRequest } from "./clerk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await authenticateClerkRequest(opts.req);
    console.log('[Auth:context] createContext result:', user ? `user=${user.id}` : 'no user');
  } catch (error) {
    console.log('[Auth:context] createContext auth error (continuing as public):', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
