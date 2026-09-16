import { useEffect, useState } from 'react';

import {
  getFirebaseInitSnapshot,
  subscribeFirebaseInitSnapshot,
  type FirebaseInitStatus,
} from '@/lib/firebase-init-state';

interface UseFirebaseStatusResult {
  status: FirebaseInitStatus;
  message: string | null;
}

/**
 * Subscribes to Firebase initialisation status for global banners.
 *
 * @returns Current init status and optional message.
 */
export function useFirebaseStatus(): UseFirebaseStatusResult {
  const [state, setState] = useState(getFirebaseInitSnapshot);

  useEffect(() => subscribeFirebaseInitSnapshot(() => setState(getFirebaseInitSnapshot())), []);

  return state;
}
