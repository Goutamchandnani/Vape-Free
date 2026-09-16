import { useCallback, useMemo } from 'react';

import { useTodayTracking } from '@/hooks/use-today-tracking';
import { useUserProfile } from '@/hooks/use-user-profile';
import { buildDailyPlanProgress } from '@/lib/daily-plan-progress';
import { calculateStreakDays } from '@/lib/streak-calculator';

/**
 * Aggregates profile and tracking data for the home dashboard.
 *
 * @returns Combined dashboard state and refresh helper.
 */
export function useHomeDashboard() {
  const { profile, planSummary, isLoading: isProfileLoading, refreshProfile } = useUserProfile();
  const {
    summary,
    isLoading: isTrackingLoading,
    refreshSummary,
  } = useTodayTracking();

  const dailyProgress = useMemo(
    () => buildDailyPlanProgress(profile, summary.puffCountToday),
    [profile, summary.puffCountToday],
  );

  const streakDays = calculateStreakDays(profile?.completedAt ?? null);

  const refreshDashboard = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshSummary()]);
  }, [refreshProfile, refreshSummary]);

  return {
    profile,
    planSummary,
    dailyProgress,
    streakDays,
    cravingCountToday: summary.cravingCountToday,
    isLoading: isProfileLoading || isTrackingLoading,
    refreshDashboard,
  };
}
