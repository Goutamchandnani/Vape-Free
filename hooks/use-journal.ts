import { useCallback, useEffect, useState } from 'react';

import { ANALYTICS_EVENTS, trackAnalyticsEvent } from '@/lib/analytics-service';
import {
  deleteJournalEntry,
  getJournalEntries,
  saveJournalEntry,
  updateJournalEntry,
} from '@/lib/journal-repository';
import type { JournalEntry } from '@/types';

interface UseJournalResult {
  entries: JournalEntry[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  refreshEntries: () => Promise<void>;
  createEntry: (body: string, moodTag: string | null) => Promise<void>;
  updateEntry: (entryId: string, body: string, moodTag: string | null) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
}

/**
 * Loads and saves journal entries for the Journal screen.
 *
 * @returns Journal history, mutation helpers, and loading states.
 */
export function useJournal(): UseJournalResult {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshEntries = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextEntries = await getJournalEntries();
      setEntries(nextEntries);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not load journal entries.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntry = useCallback(
    async (body: string, moodTag: string | null) => {
      const trimmed = body.trim();

      if (!trimmed) {
        return;
      }

      setIsSaving(true);
      setErrorMessage(null);

      try {
        await saveJournalEntry({ body: trimmed, moodTag });
        trackAnalyticsEvent(ANALYTICS_EVENTS.journalEntryCreated, {
          has_mood_tag: Boolean(moodTag),
        });
        await refreshEntries();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not save your entry.');
      } finally {
        setIsSaving(false);
      }
    },
    [refreshEntries],
  );

  const updateEntry = useCallback(
    async (entryId: string, body: string, moodTag: string | null) => {
      const trimmed = body.trim();

      if (!trimmed) {
        return;
      }

      setIsSaving(true);
      setErrorMessage(null);

      try {
        await updateJournalEntry(entryId, { body: trimmed, moodTag });
        await refreshEntries();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not update your entry.');
      } finally {
        setIsSaving(false);
      }
    },
    [refreshEntries],
  );

  const deleteEntry = useCallback(
    async (entryId: string) => {
      setIsSaving(true);
      setErrorMessage(null);

      try {
        await deleteJournalEntry(entryId);
        await refreshEntries();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not delete your entry.');
      } finally {
        setIsSaving(false);
      }
    },
    [refreshEntries],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      setIsLoading(true);

      try {
        const nextEntries = await getJournalEntries();

        if (isMounted) {
          setEntries(nextEntries);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load journal entries.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    entries,
    isLoading,
    isSaving,
    errorMessage,
    refreshEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
