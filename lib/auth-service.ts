import { getFirebaseAuth } from '@/lib/firebase-client';
import { signInAnonymously, onAuthStateChanged, type User } from '@/lib/firebase-native';
import { createAppError, toAppError } from '@/lib/create-app-error';

/**
 * Returns the current Firebase Auth user if a session already exists.
 *
 * @returns Signed-in user or null.
 */
export function getCurrentAuthUser(): User | null {
  return getFirebaseAuth().currentUser;
}

/**
 * Ensures the device has an anonymous Firebase Auth session for Firestore access.
 *
 * @returns Authenticated anonymous user.
 */
export async function ensureAnonymousAuth(): Promise<User> {
  const auth = getFirebaseAuth();
  const existingUser = auth.currentUser;

  if (existingUser) {
    return existingUser;
  }

  try {
    const credential = await signInAnonymously(auth);
    return credential.user;
  } catch (error) {
    throw createAppError('auth_failed', toAppError(error).message, true);
  }
}

/**
 * Subscribes to Firebase Auth session changes.
 *
 * @param listener - Callback invoked when the auth user changes.
 * @returns Unsubscribe function.
 */
export function subscribeToAuthState(listener: (user: User | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), listener);
}
