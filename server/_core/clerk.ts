import { createClerkClient } from '@clerk/backend';
import type { Request } from 'express';
import type { User } from '../../drizzle/schema';
import * as db from '../db';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Mask email for log output in production
function maskEmail(email: string | null | undefined): string {
  if (!email) return '[no-email]';
  if (process.env.NODE_ENV !== 'production') return email;
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function authenticateClerkRequest(req: Request): Promise<User | null> {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('[Auth] CLERK_SECRET_KEY not configured');
      return null;
    }

    // Use Clerk's authenticateRequest — handles both Bearer tokens and session cookies correctly
    const requestState = await clerkClient.authenticateRequest(req as any, {
      secretKey,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY,
      authorizedParties: [
        'https://allsquared.io',
        'https://www.allsquared.io',
        'https://allsquared.uk',
        'https://www.allsquared.uk',
        'http://localhost:5173',
        'http://localhost:3000',
      ],
    });

    if (!requestState.isSignedIn) {

      return null;
    }

    const clerkUserId = requestState.toAuth().userId;
    if (!clerkUserId) {
      console.log('[Auth] Signed in but no userId');
      return null;
    }

    console.log('[Auth] Verified clerkUserId:', clerkUserId);

    // Get user from our database
    let user = await db.getUserByClerkId(clerkUserId);

    if (!user) {
      // Auto-sync user from Clerk if not in DB
      console.log('[Auth] User not in DB — fetching from Clerk and syncing');
      try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
        const emailVerified = clerkUser.emailAddresses?.[0]?.verification?.status === 'verified';
        user = await syncClerkUser({ clerkId: clerkUserId, email, name, emailVerified });
        console.log('[Auth] Auto-synced new user:', user.id);
      } catch (syncErr) {
        console.warn('[Auth] Auto-sync failed:', syncErr);
        return null;
      }
    }

    console.log('[Auth] DB user found:', user.id, maskEmail(user.email));

    // Update last signed in
    await db.upsertUser({
      id: user.id,
      lastSignedIn: new Date(),
    });

    return user;
  } catch (error) {
    console.warn('[Auth] Authentication failed:', error);
    return null;
  }
}

export async function syncClerkUser(data: {
  clerkId: string;
  email: string | null;
  name: string | null;
  emailVerified?: boolean;
}): Promise<User> {
  const { clerkId, email, name, emailVerified } = data;

  const verified = emailVerified ? true : undefined;

  let user = await db.getUserByClerkId(clerkId);

  if (user) {
    const updates: Record<string, unknown> = {
      id: user.id,
      email,
      name,
      lastSignedIn: new Date(),
    };
    if (verified) updates.verified = verified;
    await db.upsertUser(updates as any);
    return (await db.getUser(user.id))!;
  }

  const userId = `clerk_${clerkId}`;
  await db.upsertUser({
    id: userId,
    clerkId,
    email,
    name,
    loginMethod: 'clerk',
    verified: verified || false,
    lastSignedIn: new Date(),
  });

  return (await db.getUser(userId))!;
}
