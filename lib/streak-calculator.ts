import type { IsoTimestamp } from '@/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates whole-day streak length from a quit start timestamp.
 * Used by progress visualisation; day boundaries use the device local timezone.
 *
 * @param quitStartAt - ISO timestamp when the user began their quit path.
 * @param now - Reference time, injectable for deterministic tests.
 * @returns Non-negative day count, zero if quit has not started yet.
 */
export function calculateStreakDays(quitStartAt: IsoTimestamp | null, now: Date = new Date()): number {
  if (!quitStartAt) {
    return 0;
  }

  const start = new Date(quitStartAt);

  if (Number.isNaN(start.getTime()) || start > now) {
    return 0;
  }

  const diffMs = now.getTime() - start.getTime();
  return Math.floor(diffMs / MS_PER_DAY);
}

/**
 * Determines whether a streak milestone has been reached.
 *
 * @param streakDays - Current streak length in whole days.
 * @param milestoneDays - Target milestone from the reduction plan.
 * @returns True when the streak meets or exceeds the milestone.
 */
export function hasReachedMilestone(streakDays: number, milestoneDays: number): boolean {
  return streakDays >= milestoneDays;
}
