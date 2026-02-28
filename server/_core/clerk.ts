import { createClerkClient } from '@clerk/backend';
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
      return null;
    }

    const token = authHeader?.replace('Bearer ', '') || sessionCookie;
    if (!token) {
      return null;
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('[Clerk] CLERK_SECRET_KEY not configured');
      return null;
    }

    // Use Clerk client to verify session
    try {
      const sessions = await clerkClient.sessions.verifySession(token, token);
      if (!sessions?.userId) {
        return null;
      }

      const clerkUserId = sessions.userId;

      // Get user from our database
      let user = await db.getUserByClerkId(clerkUserId);
      
      if (!user) {
        // User hasn't been synced yet - this is OK, sync happens on frontend
        return null;
      }

      // Update last signed in
      await db.upsertUser({
        id: user.id,
        lastSignedIn: new Date(),
      });

      return user;
    } catch (verifyError) {
      // Token verification failed
      console.warn('[Clerk] Token verification failed:', verifyError);
      return null;
    }
  } catch (error) {
    console.warn('[Clerk] Authentication failed:', error);
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
