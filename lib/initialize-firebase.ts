import { initializeFirebaseServices } from '@/lib/firebase-client';
import { setFirebaseInitSnapshot } from '@/lib/firebase-init-state';

import '@/lib/firebase-native';

try {
  initializeFirebaseServices();
} catch (error) {
  setFirebaseInitSnapshot(
    'failed',
    'Cloud sync is unavailable right now. You can keep using the app, but new data may not save.',
  );
  console.error('Firebase initialisation failed:', error);
}
