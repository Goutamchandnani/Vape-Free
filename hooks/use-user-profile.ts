import { useCallback, useEffect, useState } from 'react';

import { useAuthSession } from '@/hooks/use-auth-session';
import { getStoredOnboardingProfile } from '@/lib/onboarding-storage';
import { getPlanSummary, toPlanProfile, type PlanProfile } from '@/lib/plan-profile';
import { getUserProfile } from '@/lib/user-profile-repository';

interface UseUserProfileResult {
  profile: PlanProfile | null;
  planSummary: string;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

/**
 * Loads the user's plan profile from Firestore with a local onboarding fallback.
 *
 * @returns Plan profile, summary copy, loading state, and refresh helper.
 */
export function useUserProfile(): UseUserProfileResult {
  const { user, isLoading: isAuthLoading } = useAuthSession();
  const [profile, setProfile] = useState<PlanProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    setIsProfileLoading(true);

    try {
      if (user) {
        const remoteProfile = await getUserProfile(user.uid);
        setProfile(toPlanProfile(remoteProfile));
        return;
      }

      const localProfile = await getStoredOnboardingProfile();
      setProfile(toPlanProfile(localProfile));
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsProfileLoading(true);

      try {
        if (user) {
          const remoteProfile = await getUserProfile(user.uid);

          if (isMounted) {
            setProfile(toPlanProfile(remoteProfile));
          }

          return;
        }

        const localProfile = await getStoredOnboardingProfile();

        if (isMounted) {
          setProfile(toPlanProfile(localProfile));
        }
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    profile,
    planSummary: getPlanSummary(profile),
    isLoading: isAuthLoading || isProfileLoading,
    refreshProfile,
  };
}
