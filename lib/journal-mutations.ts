import { buildJournalEntry, type CreateJournalEntryInput } from '@/lib/build-journal-entry';
import type { JournalEntry } from '@/types';

export interface UpdateJournalEntryInput {
  body: string;
  moodTag?: string | null;
}

/**
 * Applies updated journal fields while preserving document identity.
 *
 * @param entry - Existing journal entry.
 * @param input - Updated body and mood tag.
 * @returns Journal entry ready for Firestore merge write.
 */
export function applyJournalEntryUpdate(
  entry: JournalEntry,
  input: UpdateJournalEntryInput,
): JournalEntry {
  const now = new Date().toISOString();

  return {
    ...entry,
    body: input.body.trim(),
    moodTag: input.moodTag ?? null,
    updatedAt: now,
  };
}

export type { CreateJournalEntryInput };
export { buildJournalEntry };
