import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { trpc } from '@/lib/trpc';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [synced, setSynced] = useState(false);

  // Sync Clerk user to our database
  const syncUserMutation = trpc.auth.syncClerkUser.useMutation({
    onSuccess: () => {
      setSynced(true);
      // Refetch the me query after sync so we get the DB user
      utils.auth.me.invalidate();
    },
    onError: () => {
      // Even on error, mark synced so we don't block forever
      setSynced(true);
    },
  });

  // Sync user on sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && !synced && !syncUserMutation.isPending) {
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
    }
  }, [isLoaded, isSignedIn]);

  const logout = useCallback(async () => {
    await signOut();
    setSynced(false);
    utils.auth.me.setData(undefined, null);
  }, [signOut, utils]);

  // Query DB user to get role and other server-side fields
  // Only enable after sync has completed to avoid race condition
  const { data: dbUser, isLoading: dbUserLoading } = trpc.auth.me.useQuery<MeQueryResult>(undefined, {
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

    // Still syncing or waiting for DB user
    if (!synced || !dbUser) {
      return {
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      };
    }

    // Combine Clerk's frontend user data with our backend user data
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
  }, [isLoaded, isSignedIn, clerkUser, dbUser, synced]);

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
