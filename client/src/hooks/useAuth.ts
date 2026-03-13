import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { trpc } from '@/lib/trpc';
import { useCallback, useEffect, useMemo } from 'react';
import { MeQueryResult } from '@/lib/trpc-types';

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false } = options ?? {};
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const { getToken } = useClerkAuth();
  const utils = trpc.useUtils();

  // Sync Clerk user to our database
  const syncUserMutation = trpc.auth.syncClerkUser.useMutation();

  // Sync user on sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      syncUserMutation.mutate({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      });
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const logout = useCallback(async () => {
    await signOut();
    utils.auth.me.setData(undefined, null);
  }, [signOut, utils]);

  // Query DB user to get role and other server-side fields
  const { data: dbUser } = trpc.auth.me.useQuery<MeQueryResult>(undefined, {
    enabled: isLoaded && !!isSignedIn,
    staleTime: Infinity, // User session data is stable, don't refetch on window focus
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

    if (!isSignedIn || !clerkUser || !dbUser) {
      return {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    }

    // Combine Clerk's frontend user data with our backend user data
    return {
      user: {
        id: dbUser.id, // Use our DB id as the canonical id
        clerkId: clerkUser.id,
        name: dbUser.name ?? clerkUser.fullName,
        email: dbUser.email ?? clerkUser.primaryEmailAddress?.emailAddress ?? null,
        profilePhoto: clerkUser.imageUrl,
        role: dbUser.role, // This now has the correct type
      },
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }, [isLoaded, isSignedIn, clerkUser, dbUser]);

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
