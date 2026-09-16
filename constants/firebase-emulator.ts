import type { FirebaseClientConfig } from '@/types';

/** Default emulator ports aligned with firebase.json. */
export const FIREBASE_EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  functions: 5001,
  ui: 4000,
} as const;

/** Project ID used by emulators and .firebaserc on the Spark plan. */
export const FIREBASE_PROJECT_ID = 'vapefree-msc';

/**
 * Demo client config for Firebase Emulator Suite.
 * These are not secrets. Emulators accept any API key when running locally.
 */
export const EMULATOR_FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: 'demo-api-key',
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: '545653308708',
  appId: '1:545653308708:web:local-emulator',
};
