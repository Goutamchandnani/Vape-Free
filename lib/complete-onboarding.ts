import { ensureAnonymousAuth } from '@/lib/auth-service';
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from '@/lib/analytics-service';
import {
  getStoredOnboardingProfile,
  saveStoredOnboardingProfile,
  type StoredOnboardingProfile,
} from '@/lib/onboarding-storage';
import { buildUserProfileFromOnboarding } from '@/lib/build-user-profile-from-onboarding';
import { getUserProfile, saveUserProfile } from '@/lib/user-profile-repository';

/**
 * Uploads a locally stored onboarding profile when Firestore has no profile yet.
 *
 * @param userId - Firebase Auth UID.
 */
export async function syncLocalProfileIfNeeded(userId: string): Promise<void> {
  const localProfile = await getStoredOnboardingProfile();

  if (!localProfile?.onboardingCompleted) {
    return;
  }

  const remoteProfile = await getUserProfile(userId);

  if (remoteProfile?.onboardingCompleted) {
    return;
  }

  await saveUserProfile(buildUserProfileFromOnboarding(userId, localProfile));
}

/**
 * Completes onboarding by saving locally, signing in anonymously, and syncing Firestore.
 *
 * @param onboarding - Completed onboarding payload.
 */
export async function completeOnboarding(onboarding: StoredOnboardingProfile): Promise<void> {
  await saveStoredOnboardingProfile(onboarding);
  const user = await ensureAnonymousAuth();
  await saveUserProfile(buildUserProfileFromOnboarding(user.uid, onboarding));
  trackAnalyticsEvent(ANALYTICS_EVENTS.onboardingCompleted, {
    quit_path: onboarding.quitPath ?? 'unknown',
  });
}
