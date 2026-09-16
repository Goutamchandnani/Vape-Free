import type { StoredOnboardingProfile } from '@/lib/onboarding-storage';
import type { IsoTimestamp, UserProfile } from '@/types';

/**
 * Builds a Firestore user profile document from onboarding selections.
 *
 * @param userId - Firebase Auth UID owning the profile.
 * @param onboarding - Completed onboarding payload.
 * @param timestamps - Optional created timestamp when migrating existing data.
 * @returns Normalised user profile document.
 */
export function buildUserProfileFromOnboarding(
  userId: string,
  onboarding: StoredOnboardingProfile,
  timestamps?: { createdAt: IsoTimestamp },
): UserProfile {
  const now = new Date().toISOString();

  return {
    id: userId,
    userId,
    participantId: null,
    displayName: null,
    quitPath: onboarding.quitPath,
    reductionPace: onboarding.reductionPace,
    dailyBaselinePuffs: onboarding.dailyBaselinePuffs,
    startingDailyTarget: onboarding.startingDailyTarget,
    targetQuitDate: onboarding.targetQuitDate,
    onboardingCompleted: onboarding.onboardingCompleted,
    completedAt: onboarding.completedAt,
    createdAt: timestamps?.createdAt ?? now,
    updatedAt: now,
    isPendingSync: false,
  };
}
