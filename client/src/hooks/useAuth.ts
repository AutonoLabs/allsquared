import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { trpc } from '@/lib/trpc';
import { useCallback, useEffect, useMemo } from 'react';

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = '/sign-in' } = options ?? {};
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
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const logout = useCallback(async () => {
    await signOut();
    utils.auth.me.setData(undefined, null);
  }, [signOut, utils]);

  const state = useMemo(() => {
    if (!isLoaded) {
      return {
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      };
    }

    return {
      user: isSignedIn && clerkUser ? {
        id: clerkUser.id,
        name: clerkUser.fullName ?? clerkUser.firstName ?? 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        profilePhoto: clerkUser.imageUrl ?? null,
      } : null,
      loading: false,
      error: null,
      isAuthenticated: isSignedIn ?? false,
    };
  }, [isLoaded, isSignedIn, clerkUser]);

  // Redirect to sign-in if needed
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (!isLoaded) return;
    if (isSignedIn) return;
    if (typeof window === 'undefined') return;

    openSignIn();
  }, [redirectOnUnauthenticated, isLoaded, isSignedIn, openSignIn]);

  return {
    ...state,
    refresh: () => {}, // Clerk handles this automatically
    logout,
    getToken,
  };
}
