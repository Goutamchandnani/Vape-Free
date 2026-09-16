/** Top-level Firestore collection names used by the mobile client. */
export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  researchProfiles: 'researchProfiles',
  counters: 'counters',
} as const;

/** Counter document ids for server-side sequences. */
export const FIRESTORE_COUNTERS = {
  researchParticipants: 'researchParticipants',
} as const;

/** Subcollections under users/{userId}. */
export const USER_SUBCOLLECTIONS = {
  vapingSessions: 'vapingSessions',
  cravingLogs: 'cravingLogs',
  chatMessages: 'chatMessages',
  journalEntries: 'journalEntries',
} as const;

/** Document path for a user's profile: users/{userId} */
export function getUserProfileDocumentPath(userId: string): string {
  return `${FIRESTORE_COLLECTIONS.users}/${userId}`;
}
