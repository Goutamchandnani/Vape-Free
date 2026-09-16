import { FIRESTORE_COLLECTIONS } from '@/constants/firestore-collections';
import { getFirebaseFirestore } from '@/lib/firebase-client';
import { buildUserProfileFromOnboarding } from '@/lib/build-user-profile-from-onboarding';
import { doc, getDoc, setDoc } from '@/lib/firebase-native';
import type { UserProfile } from '@/types';

export { buildUserProfileFromOnboarding };

/**
 * Reads the authenticated user's profile document from Firestore.
 *
 * @param userId - Firebase Auth UID.
 * @returns Stored profile or null when onboarding has not synced yet.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const profileRef = doc(getFirebaseFirestore(), FIRESTORE_COLLECTIONS.users, userId);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

/**
 * Persists the user profile to Firestore with merge semantics for offline retries.
 *
 * @param profile - Profile document to write.
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const profileRef = doc(getFirebaseFirestore(), FIRESTORE_COLLECTIONS.users, profile.userId);
  await setDoc(profileRef, profile, { merge: true });
}
