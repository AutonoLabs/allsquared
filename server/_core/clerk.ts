import { createClerkClient, verifyToken } from '@clerk/backend';
import type { Request } from 'express';
import type { User } from '../../drizzle/schema';
import * as db from '../db';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function authenticateClerkRequest(req: Request): Promise<User | null> {
  try {
    const authHeader = (req as any).headers?.authorization;
    const sessionCookie = (req as any).cookies?.__session;

    if (!authHeader?.startsWith('Bearer ') && !sessionCookie) {
      console.log('[Auth] No Bearer header or __session cookie present');
      return null;
    }

    const token = authHeader?.replace('Bearer ', '') || sessionCookie;
    if (!token) {
      console.log('[Auth] Token extracted but empty');
      return null;
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('[Auth] CLERK_SECRET_KEY not configured');
      return null;
    }

    console.log('[Auth] Verifying token (first 20 chars):', token.substring(0, 20) + '...');

    // Verify the JWT token directly
    try {
      const payload = await verifyToken(token, {
        secretKey,
      });

      if (!payload?.sub) {
        console.log('[Auth] Token verified but no sub claim');
        return null;
      }

      const clerkUserId = payload.sub;
      console.log('[Auth] Token verified, clerkUserId:', clerkUserId);

      // Get user from our database
      let user = await db.getUserByClerkId(clerkUserId);

      if (!user) {
        console.log('[Auth] No DB user found for clerkId:', clerkUserId, '(sync pending)');
        return null;
      }

      console.log('[Auth] DB user found:', user.id, user.email);

      // Update last signed in
      await db.upsertUser({
        id: user.id,
        lastSignedIn: new Date(),
      });

      return user;
    } catch (verifyError) {
      console.warn('[Auth] Token verification failed:', verifyError);
      return null;
    }
  } catch (error) {
    console.warn('[Auth] Authentication failed:', error);
    return null;
  }
}

export async function syncClerkUser(data: {
  clerkId: string;
  email: string | null;
  name: string | null;
}): Promise<User> {
  const { clerkId, email, name } = data;
  
  // Check if user already exists
  let user = await db.getUserByClerkId(clerkId);
  
  if (user) {
    // Update existing user
    await db.upsertUser({
      id: user.id,
      email,
      name,
      lastSignedIn: new Date(),
    });
    return (await db.getUser(user.id))!;
  }

  // Create new user
  const userId = `clerk_${clerkId}`;
  await db.upsertUser({
    id: userId,
    clerkId,
    email,
    name,
    loginMethod: 'clerk',
    lastSignedIn: new Date(),
  });

  return (await db.getUser(userId))!;
}
