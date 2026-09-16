import { useCallback, useEffect, useState } from 'react';

import { getTodayTrackingSummary, type TodayTrackingSummary } from '@/lib/tracking-repository';

interface UseTodayTrackingResult {
  summary: TodayTrackingSummary;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  refreshSummary: () => Promise<void>;
  runTrackingAction: (action: () => Promise<void>) => Promise<void>;
}

const EMPTY_SUMMARY: TodayTrackingSummary = {
  puffCountToday: 0,
  cravingCountToday: 0,
  sessionsToday: [],
  cravingsToday: [],
};

/**
 * Loads and refreshes today's puff and craving tracking summary.
 *
 * @returns Tracking summary state and action helpers for the Track screen.
 */
export function useTodayTracking(): UseTodayTrackingResult {
  const [summary, setSummary] = useState<TodayTrackingSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshSummary = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextSummary = await getTodayTrackingSummary();
      setSummary(nextSummary);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not load tracking data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runTrackingAction = useCallback(
    async (action: () => Promise<void>) => {
      setIsSaving(true);
      setErrorMessage(null);

      try {
        await action();
        await refreshSummary();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not save your log.');
      } finally {
        setIsSaving(false);
      }
    },
    [refreshSummary],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setIsLoading(true);

      try {
        const nextSummary = await getTodayTrackingSummary();

        if (isMounted) {
          setSummary(nextSummary);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load tracking data.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    summary,
    isLoading,
    isSaving,
    errorMessage,
    refreshSummary,
    runTrackingAction,
  };
}
