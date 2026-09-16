import { Platform } from 'react-native';

import { FIREBASE_EMULATOR_PORTS } from '@/constants/firebase-emulator';

/**
 * Returns true when the app should use the local Firebase Emulator Suite.
 * Enabled via EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true for no-cost local development.
 *
 * @returns Whether emulator connections should be used.
 */
export function shouldUseFirebaseEmulators(): boolean {
  if (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS !== 'true') {
    return false;
  }

  if (__DEV__) {
    return true;
  }

  const host = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST?.trim();
  return Boolean(host);
}

/**
 * Resolves the host name for Firebase emulators on the current platform.
 * Android emulators reach the dev machine via 10.0.2.2 instead of localhost.
 *
 * @returns Host string for connect*Emulator calls.
 */
export function getFirebaseEmulatorHost(): string {
  const configuredHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;

  if (configuredHost && configuredHost.trim().length > 0) {
    return configuredHost.trim();
  }

  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
}

/**
 * Builds the Auth emulator URL for connectAuthEmulator.
 *
 * @param host - Emulator host from getFirebaseEmulatorHost.
 * @returns Auth emulator base URL.
 */
export function getAuthEmulatorUrl(host: string): string {
  return `http://${host}:${FIREBASE_EMULATOR_PORTS.auth}`;
}
