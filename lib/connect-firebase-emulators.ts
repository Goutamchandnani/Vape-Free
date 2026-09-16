import { FIREBASE_EMULATOR_PORTS } from '@/constants/firebase-emulator';
import {
  connectAuthEmulator,
  connectFirestoreEmulator,
  connectFunctionsEmulator,
  type Auth,
  type Firestore,
  type Functions,
} from '@/lib/firebase-native';
import {
  getAuthEmulatorUrl,
  getFirebaseEmulatorHost,
} from '@/lib/should-use-firebase-emulators';

export interface FirebaseEmulatorServices {
  auth: Auth;
  firestore: Firestore;
  functions: Functions;
}

let hasConnectedEmulators = false;

/**
 * Points Firebase SDK clients at the local Emulator Suite.
 * Must run once before any Auth, Firestore, or Functions traffic.
 *
 * @param services - Initialised Firebase service instances.
 */
export function connectFirebaseEmulators(services: FirebaseEmulatorServices): void {
  if (hasConnectedEmulators) {
    return;
  }

  const host = getFirebaseEmulatorHost();

  connectAuthEmulator(services.auth, getAuthEmulatorUrl(host), { disableWarnings: true });
  connectFirestoreEmulator(services.firestore, host, FIREBASE_EMULATOR_PORTS.firestore);
  connectFunctionsEmulator(services.functions, host, FIREBASE_EMULATOR_PORTS.functions);

  hasConnectedEmulators = true;
}

/**
 * Resets emulator connection state. Used in tests only.
 */
export function resetFirebaseEmulatorConnectionForTests(): void {
  hasConnectedEmulators = false;
}
