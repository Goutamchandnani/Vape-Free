import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirebaseClientConfig } from '@/lib/firebase-config';
import { connectFirebaseEmulators } from '@/lib/connect-firebase-emulators';
import { initializeAnalyticsService } from '@/lib/analytics-service';
import { setFirebaseInitSnapshot } from '@/lib/firebase-init-state';
import { isAuthAlreadyInitializedError } from '@/lib/is-auth-already-initialized-error';
import {
  getApp,
  getApps,
  getAuth,
  getFunctions,
  getReactNativePersistence,
  initializeApp,
  initializeAuth,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  type Auth,
  type FirebaseApp,
  type Firestore,
  type Functions,
} from '@/lib/firebase-native';
import { shouldUseFirebaseEmulators } from '@/lib/should-use-firebase-emulators';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseFirestore: Firestore | null = null;
let firebaseFunctions: Functions | null = null;
let hasInitializedServices = false;

/**
 * Ensures Firebase Auth is registered on React Native before other services.
 *
 * @param app - Firebase app instance.
 * @returns Initialised Auth instance.
 */
function ensureFirebaseAuth(app: FirebaseApp): Auth {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  try {
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (isAuthAlreadyInitializedError(error)) {
      firebaseAuth = getAuth(app);
    } else {
      throw error;
    }
  }

  return firebaseAuth;
}

/**
 * Returns the singleton Firebase app instance, initialising on first access.
 *
 * @returns Initialised Firebase app.
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = getFirebaseClientConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  ensureFirebaseAuth(app);
  firebaseApp = app;

  return app;
}

/**
 * Returns Firebase Auth with AsyncStorage persistence across cold starts.
 *
 * @returns Auth instance bound to the shared Firebase app.
 */
export function getFirebaseAuth(): Auth {
  return ensureFirebaseAuth(getFirebaseApp());
}

/**
 * Returns Firestore with a persistent local cache for offline-first writes.
 *
 * @returns Firestore instance with local persistence enabled.
 */
export function getFirebaseFirestore(): Firestore {
  if (firebaseFirestore) {
    return firebaseFirestore;
  }

  const app = getFirebaseApp();

  try {
    firebaseFirestore = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch (error) {
    firebaseFirestore = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
    setFirebaseInitSnapshot(
      'memory_cache',
      'Offline cache is limited in this preview build. Your logs still save while you are online.',
    );
    console.warn('Firestore persistent cache unavailable, using memory cache.', error);
  }

  return firebaseFirestore;
}

/**
 * Returns the Cloud Functions client used for Gemini chat requests.
 *
 * @param region - Firebase Functions region, defaults to europe-west2.
 * @returns Functions instance for callable HTTPS endpoints.
 */
export function getFirebaseFunctions(region = 'europe-west2'): Functions {
  if (firebaseFunctions) {
    return firebaseFunctions;
  }

  firebaseApp = getFirebaseApp();
  firebaseFunctions = getFunctions(firebaseApp, region);
  return firebaseFunctions;
}

/**
 * Initialises Firebase services and connects emulators when enabled.
 */
export function initializeFirebaseServices(): void {
  if (hasInitializedServices) {
    return;
  }

  const auth = getFirebaseAuth();
  const firestore = getFirebaseFirestore();
  const region = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? 'europe-west2';
  const functions = getFirebaseFunctions(region);

  if (shouldUseFirebaseEmulators()) {
    connectFirebaseEmulators({ auth, firestore, functions });
  }

  void initializeAnalyticsService();

  hasInitializedServices = true;
}
