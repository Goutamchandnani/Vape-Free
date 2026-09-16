export type FirebaseInitStatus = 'ready' | 'memory_cache' | 'failed';

interface FirebaseInitSnapshot {
  status: FirebaseInitStatus;
  message: string | null;
}

let snapshot: FirebaseInitSnapshot = {
  status: 'ready',
  message: null,
};

const listeners = new Set<() => void>();

/**
 * Returns the current Firebase initialisation status for UI banners.
 *
 * @returns Status and optional user-facing message.
 */
export function getFirebaseInitSnapshot(): FirebaseInitSnapshot {
  return snapshot;
}

/**
 * Updates Firebase initialisation status and notifies subscribers.
 *
 * @param status - Latest init outcome.
 * @param message - Optional banner copy.
 */
export function setFirebaseInitSnapshot(status: FirebaseInitStatus, message: string | null = null): void {
  snapshot = { status, message };
  listeners.forEach((listener) => listener());
}

/**
 * Subscribes to Firebase init status changes.
 *
 * @param listener - Callback invoked when status updates.
 * @returns Unsubscribe function.
 */
export function subscribeFirebaseInitSnapshot(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
