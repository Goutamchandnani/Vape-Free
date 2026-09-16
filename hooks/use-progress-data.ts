import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUserProfile } from '@/hooks/use-user-profile';
import { evaluateMilestones } from '@/lib/milestones';
import {
  buildDailyPuffSeries,
  calculateWeekOverWeekChange,
  type DailyPuffPoint,
} from '@/lib/progress-chart';
import { calculateStreakDays } from '@/lib/streak-calculator';
import {
  getProgressTrackingSummary,
  type HistoricalTrackingSummary,
} from '@/lib/tracking-repository';
import type { MilestoneStatus } from '@/lib/milestones';

const EMPTY_TRACKING: HistoricalTrackingSummary = {
  sessions: [],
  cravings: [],
};

interface UseProgressDataResult {
  dailySeries: DailyPuffPoint[];
  weekOverWeekChange: number | null;
  milestones: MilestoneStatus[];
  streakDays: number;
  isLoading: boolean;
  errorMessage: string | null;
  refreshProgress: () => Promise<void>;
}

/**
 * Loads historical tracking data and derives progress chart and milestone state.
 *
 * @returns Progress screen metrics and refresh helper.
 */
export function useProgressData(): UseProgressDataResult {
  const { profile, isLoading: isProfileLoading, refreshProfile } = useUserProfile();
  const [tracking, setTracking] = useState<HistoricalTrackingSummary>(EMPTY_TRACKING);
  const [isTrackingLoading, setIsTrackingLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshProgress = useCallback(async () => {
    setIsTrackingLoading(true);

    try {
      const [nextTracking] = await Promise.all([getProgressTrackingSummary(), refreshProfile()]);
      setTracking(nextTracking);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not load progress data.');
    } finally {
      setIsTrackingLoading(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      setIsTrackingLoading(true);

      try {
        const nextTracking = await getProgressTrackingSummary();

        if (isMounted) {
          setTracking(nextTracking);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load progress data.');
        }
      } finally {
        if (isMounted) {
          setIsTrackingLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const dailySeries = useMemo(
    () => buildDailyPuffSeries(tracking.sessions, 7),
    [tracking.sessions],
  );

  const weekOverWeekChange = useMemo(
    () => calculateWeekOverWeekChange(tracking.sessions),
    [tracking.sessions],
  );

  const streakDays = calculateStreakDays(profile?.completedAt ?? null);

  const milestones = useMemo(
    () =>
      evaluateMilestones({
        streakDays,
        dailyBaselinePuffs: profile?.dailyBaselinePuffs ?? 0,
        sessions: tracking.sessions,
        cravings: tracking.cravings,
      }),
    [profile?.dailyBaselinePuffs, streakDays, tracking.cravings, tracking.sessions],
  );

  return {
    dailySeries,
    weekOverWeekChange,
    milestones,
    streakDays,
    isLoading: isProfileLoading || isTrackingLoading,
    errorMessage,
    refreshProgress,
  };
}
