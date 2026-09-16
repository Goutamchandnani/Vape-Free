import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ReductionPace } from '@/lib/reduction-pace';
import type { IsoTimestamp, QuitPath } from '@/types';

export const ONBOARDING_PROFILE_STORAGE_KEY = '@vapefree/onboarding-profile';

/** Locally persisted onboarding outcome for offline-first access and Firestore sync. */
export interface StoredOnboardingProfile {
  quitPath: QuitPath;
  reductionPace: ReductionPace | null;
  dailyBaselinePuffs: number;
  startingDailyTarget: number;
  targetQuitDate: IsoTimestamp | null;
  onboardingCompleted: boolean;
  completedAt: IsoTimestamp;
}

/**
 * Reads the saved onboarding profile from device storage.
 *
 * @returns Parsed profile or null when onboarding has not been completed.
 */
export async function getStoredOnboardingProfile(): Promise<StoredOnboardingProfile | null> {
  const rawValue = await AsyncStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as StoredOnboardingProfile;
}

/**
 * Persists the onboarding profile locally for offline-first access.
 *
 * @param profile - Completed onboarding profile to store.
 */
export async function saveStoredOnboardingProfile(profile: StoredOnboardingProfile): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Clears stored onboarding data. Used in tests and future account reset flows.
 */
export async function clearStoredOnboardingProfile(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_PROFILE_STORAGE_KEY);
}
