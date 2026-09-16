import type { StoredOnboardingProfile } from '@/lib/onboarding-storage';
import { REDUCTION_PACE_LABELS } from '@/lib/reduction-pace';
import type { UserProfile } from '@/types';

export type PlanProfile = Pick<
  UserProfile,
  | 'quitPath'
  | 'reductionPace'
  | 'dailyBaselinePuffs'
  | 'startingDailyTarget'
  | 'onboardingCompleted'
  | 'completedAt'
>;

/**
 * Normalises Firestore and local onboarding profiles into a shared plan shape.
 *
 * @param profile - Firestore profile or locally stored onboarding profile.
 * @returns Shared plan fields for UI rendering.
 */
export function toPlanProfile(
  profile: UserProfile | StoredOnboardingProfile | null,
): PlanProfile | null {
  if (!profile) {
    return null;
  }

  return {
    quitPath: profile.quitPath,
    reductionPace: profile.reductionPace,
    dailyBaselinePuffs: profile.dailyBaselinePuffs,
    startingDailyTarget: profile.startingDailyTarget,
    onboardingCompleted: profile.onboardingCompleted,
    completedAt: profile.completedAt,
  };
}

/**
 * Builds the home dashboard plan summary copy from a plan profile.
 *
 * @param profile - Normalised plan profile.
 * @returns Accessible summary string for the dashboard card.
 */
export function getPlanSummary(profile: PlanProfile | null): string {
  if (!profile?.onboardingCompleted) {
    return 'Complete onboarding to personalise your reduction plan and daily targets.';
  }

  if (profile.quitPath === 'abrupt') {
    return 'Abrupt quit path. Focus on craving support and daily check-ins.';
  }

  const paceLabel = profile.reductionPace
    ? REDUCTION_PACE_LABELS[profile.reductionPace]
    : 'Gradual reduction plan';

  return `${paceLabel}. Starting target: ${profile.startingDailyTarget ?? 0} puffs per day.`;
}
