import { createTrackingDocumentId } from '@/lib/tracking-utils';
import type { IsoTimestamp, JournalEntry } from '@/types';

export interface CreateJournalEntryInput {
  userId: string;
  body: string;
  moodTag?: string | null;
  loggedAt?: IsoTimestamp;
}

/**
 * Builds a journal entry document ready for Firestore persistence.
 *
 * @param input - Journal fields from the Journal screen.
 * @returns Normalised journal entry document.
 */
export function buildJournalEntry(input: CreateJournalEntryInput): JournalEntry {
  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;
  const id = createTrackingDocumentId();

  return {
    id,
    userId: input.userId,
    body: input.body.trim(),
    moodTag: input.moodTag ?? null,
    loggedAt,
    createdAt: now,
    updatedAt: now,
    isPendingSync: false,
  };
}
