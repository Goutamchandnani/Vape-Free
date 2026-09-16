import type { FirebaseClientConfig } from '@/types';
import {
  EMULATOR_FIREBASE_CONFIG,
  FIREBASE_PROJECT_ID,
} from '@/constants/firebase-emulator';
import { createAppError } from '@/lib/create-app-error';
import { shouldUseFirebaseEmulators } from '@/lib/should-use-firebase-emulators';

/**
 * Reads Firebase client configuration from Expo public environment variables.
 * Falls back to emulator demo config when EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true.
 * Only non-secret Firebase web keys belong here. Gemini keys stay in Cloud Functions.
 *
 * @returns Validated Firebase client configuration.
 * @throws AppError when required keys are missing in production mode.
 */
export function getFirebaseClientConfig(): FirebaseClientConfig {
  if (shouldUseFirebaseEmulators()) {
    return {
      ...EMULATOR_FIREBASE_CONFIG,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? FIREBASE_PROJECT_ID,
    };
  }

  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw createAppError(
      'validation_failed',
      'Firebase is not configured. Copy .env.example to .env or enable emulators.',
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId: measurementId || undefined,
  };
}
