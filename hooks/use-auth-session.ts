import { useEffect, useState } from 'react';

import { ensureAnonymousAuth, subscribeToAuthState } from '@/lib/auth-service';
import { syncLocalProfileIfNeeded } from '@/lib/complete-onboarding';
import { ensureResearchProfile } from '@/lib/research-profile-service';
import { toAppError } from '@/lib/create-app-error';
import type { User } from '@/lib/firebase-native';
import type { AppError } from '@/types';

interface UseAuthSessionResult {
  user: User | null;
  isLoading: boolean;
  error: AppError | null;
}

/**
 * Boots an anonymous Firebase Auth session and keeps it in sync with Auth state.
 *
 * @returns Current auth user, loading state, and bootstrap error if sign-in fails.
 */
export function useAuthSession(): UseAuthSessionResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        const authenticatedUser = await ensureAnonymousAuth();
        await syncLocalProfileIfNeeded(authenticatedUser.uid);

        try {
          await ensureResearchProfile();
        } catch (profileError) {
          console.warn('Research profile bootstrap skipped.', profileError);
        }

        if (isMounted) {
          setUser(authenticatedUser);
          setError(null);
        }
      } catch (bootstrapError) {
        if (isMounted) {
          setError(toAppError(bootstrapError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void bootstrapAuth();

    const unsubscribe = subscribeToAuthState((nextUser) => {
      if (isMounted) {
        setUser(nextUser);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}
