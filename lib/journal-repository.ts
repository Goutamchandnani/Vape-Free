import { FIRESTORE_COLLECTIONS, USER_SUBCOLLECTIONS } from '@/constants/firestore-collections';
import { ensureAnonymousAuth } from '@/lib/auth-service';
import { buildJournalEntry, type CreateJournalEntryInput } from '@/lib/build-journal-entry';
import { applyJournalEntryUpdate, type UpdateJournalEntryInput } from '@/lib/journal-mutations';
import { getFirebaseFirestore } from '@/lib/firebase-client';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from '@/lib/firebase-native';
import type { JournalEntry } from '@/types';

/**
 * Persists a reflective journal entry for the signed-in user.
 *
 * @param input - Entry body and optional mood tag.
 * @returns Saved journal document.
 */
export async function saveJournalEntry(
  input: Omit<CreateJournalEntryInput, 'userId'>,
): Promise<JournalEntry> {
  const user = await ensureAnonymousAuth();
  const entry = buildJournalEntry({ ...input, userId: user.uid });
  const entryRef = doc(
    getFirebaseFirestore(),
    FIRESTORE_COLLECTIONS.users,
    user.uid,
    USER_SUBCOLLECTIONS.journalEntries,
    entry.id,
  );

  await setDoc(entryRef, entry);
  return entry;
}

/**
 * Updates an existing journal entry for the signed-in user.
 *
 * @param entryId - Journal document id.
 * @param input - Updated body and mood tag.
 * @returns Updated journal document.
 */
export async function updateJournalEntry(
  entryId: string,
  input: UpdateJournalEntryInput,
): Promise<JournalEntry> {
  const user = await ensureAnonymousAuth();
  const entryRef = doc(
    getFirebaseFirestore(),
    FIRESTORE_COLLECTIONS.users,
    user.uid,
    USER_SUBCOLLECTIONS.journalEntries,
    entryId,
  );

  const snapshot = await getDoc(entryRef);

  if (!snapshot.exists()) {
    throw new Error('Journal entry not found.');
  }

  const updated = applyJournalEntryUpdate(snapshot.data() as JournalEntry, input);
  await setDoc(entryRef, updated, { merge: true });
  return updated;
}

/**
 * Deletes a journal entry for the signed-in user.
 *
 * @param entryId - Journal document id.
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  const user = await ensureAnonymousAuth();
  const entryRef = doc(
    getFirebaseFirestore(),
    FIRESTORE_COLLECTIONS.users,
    user.uid,
    USER_SUBCOLLECTIONS.journalEntries,
    entryId,
  );

  await deleteDoc(entryRef);
}

/**
 * Loads journal entries for the signed-in user, newest first.
 *
 * @returns Ordered journal history.
 */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const user = await ensureAnonymousAuth();
  const entriesQuery = query(
    collection(
      getFirebaseFirestore(),
      FIRESTORE_COLLECTIONS.users,
      user.uid,
      USER_SUBCOLLECTIONS.journalEntries,
    ),
    orderBy('loggedAt', 'desc'),
  );

  const snapshot = await getDocs(entriesQuery);
  return snapshot.docs.map((document) => document.data() as JournalEntry);
}
