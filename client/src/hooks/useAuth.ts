import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { trpc } from '@/lib/trpc';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MeQueryResult } from '@/lib/trpc-types';

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

const LOADING_TIMEOUT_MS = 5000;

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false } = options ?? {};
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const { getToken } = useClerkAuth();
  const utils = trpc.useUtils();
  const [synced, setSynced] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety timeout: if loading takes too long, show dashboard anyway
  useEffect(() => {
    if (isLoaded && isSignedIn && !synced && !timedOut) {
      timeoutRef.current = setTimeout(() => {
        console.warn('[useAuth] Sync timed out after 5s — showing dashboard with Clerk data');
        setTimedOut(true);
      }, LOADING_TIMEOUT_MS);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoaded, isSignedIn, synced, timedOut]);

  // Clear timeout when sync completes
  useEffect(() => {
    if (synced && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [synced]);

  // Sync Clerk user to our database (non-blocking)
  const syncUserMutation = trpc.auth.syncClerkUser.useMutation({
    onSuccess: () => {
      console.log('[useAuth] syncClerkUser succeeded');
      setSynced(true);
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      console.error('[useAuth] syncClerkUser failed:', err.message);
      // Still mark synced so we don't block forever
      setSynced(true);
    },
  });

  // Sync user on sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && !synced && !syncUserMutation.isPending) {
      console.log('[useAuth] Starting syncClerkUser for', clerkUser.id);
      syncUserMutation.mutate({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      });
    }
  }, [isLoaded, isSignedIn, clerkUser, synced]);

  // Reset synced state on sign-out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setSynced(false);
      setTimedOut(false);
    }
  }, [isLoaded, isSignedIn]);

  const logout = useCallback(async () => {
    await signOut();
    setSynced(false);
    setTimedOut(false);
    utils.auth.me.setData(undefined, null);
  }, [signOut, utils]);

  // Query DB user to get role and other server-side fields
  const { data: dbUser } = trpc.auth.me.useQuery<MeQueryResult>(undefined, {
    enabled: isLoaded && !!isSignedIn && synced,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const state = useMemo(() => {
    if (!isLoaded) {
      return {
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      };
    }

    if (!isSignedIn) {
      return {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    }

    // If we have full DB user data, use it
    if (synced && dbUser) {
      return {
        user: {
          id: dbUser.id,
          clerkId: clerkUser!.id,
          name: dbUser.name ?? clerkUser!.fullName,
          email: dbUser.email ?? clerkUser!.primaryEmailAddress?.emailAddress ?? null,
          profilePhoto: clerkUser!.imageUrl,
          role: dbUser.role,
        },
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    }

    // If timed out or sync completed but no DB user yet, use Clerk data as fallback
    if (timedOut || synced) {
      return {
        user: {
          id: 0,
          clerkId: clerkUser!.id,
          name: clerkUser!.fullName ?? clerkUser!.firstName ?? 'User',
          email: clerkUser!.primaryEmailAddress?.emailAddress ?? null,
          profilePhoto: clerkUser!.imageUrl,
          role: 'user' as const,
        },
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    }

    // Still syncing — show loading but don't block auth status
    return {
      user: null,
      loading: true,
      error: null,
      isAuthenticated: true, // Clerk confirmed sign-in
    };
  }, [isLoaded, isSignedIn, clerkUser, dbUser, synced, timedOut]);

  // Redirect to sign-in if needed
  useEffect(() => {
    if (!redirectOnUnauthenticated || !isLoaded || isSignedIn) return;
    openSignIn();
  }, [redirectOnUnauthenticated, isLoaded, isSignedIn, openSignIn]);

  return {
    ...state,
    refresh: () => {
      utils.auth.me.invalidate();
    },
    logout,
    getToken,
  };
}
