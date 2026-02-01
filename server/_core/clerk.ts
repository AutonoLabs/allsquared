import { clerkClient, verifyToken } from '@clerk/express';
import type { Request } from 'express';
import type { User } from '../../drizzle/schema';
import * as db from '../db';

export async function authenticateClerkRequest(req: Request): Promise<User | null> {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      // Try to get from Clerk's session cookie
      const sessionToken = req.cookies?.__session;
      if (!sessionToken) {
        return null;
      }
    }

    const token = authHeader?.replace('Bearer ', '') || req.cookies?.__session;
    if (!token) {
      return null;
    }

    // Verify the token with Clerk
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('[Clerk] CLERK_SECRET_KEY not configured');
      return null;
    }

    const verifiedToken = await verifyToken(token, {
      secretKey,
    });

    if (!verifiedToken?.sub) {
      return null;
    }

    const clerkUserId = verifiedToken.sub;

    // Get or create user in our database
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
