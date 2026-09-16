import {
  calculateGradualReductionCap,
  isWithinDailyCap,
} from '@/lib/reduction-algorithm';
import { getWeeklyReductionFactor } from '@/lib/reduction-pace';
import type { PlanProfile } from '@/lib/plan-profile';
import type { IsoTimestamp, QuitPath } from '@/types';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export interface DailyPlanProgress {
  dailyCap: number;
  loggedPuffsToday: number;
  progressPercent: number;
  isWithinCap: boolean;
  statusMessage: string;
  weekIndex: number;
}

/**
 * Calculates whole weeks elapsed since the user started their plan.
 *
 * @param startAt - ISO timestamp when onboarding completed.
 * @param now - Reference time for tests.
 * @returns Zero-based week index.
 */
export function calculateWeekIndexSinceStart(
  startAt: IsoTimestamp | null,
  now: Date = new Date(),
): number {
  if (!startAt) {
    return 0;
  }

  const start = new Date(startAt);

  if (Number.isNaN(start.getTime()) || start > now) {
    return 0;
  }

  return Math.floor((now.getTime() - start.getTime()) / MS_PER_WEEK);
}

/**
 * Returns the daily puff cap for the user's current plan week.
 *
 * @param profile - Normalised plan profile from onboarding.
 * @param now - Reference time for tests.
 * @returns Allowed puffs for today, or zero for abrupt quit paths.
 */
export function getDailyCapForPlan(profile: PlanProfile | null, now: Date = new Date()): number {
  if (!profile?.onboardingCompleted || profile.quitPath === 'abrupt') {
    return 0;
  }

  const baseline = profile.dailyBaselinePuffs ?? 0;
  const weekIndex = calculateWeekIndexSinceStart(profile.completedAt, now);
  const reductionFactor = profile.reductionPace
    ? getWeeklyReductionFactor(profile.reductionPace)
    : 0.9;

  if (weekIndex === 0 && profile.startingDailyTarget != null) {
    return profile.startingDailyTarget;
  }

  return calculateGradualReductionCap(baseline, weekIndex + 1, 5, reductionFactor);
}

/**
 * Calculates progress percentage towards the daily cap.
 *
 * @param loggedPuffsToday - Puffs logged today.
 * @param dailyCap - Allowed daily cap.
 * @returns Percentage between 0 and 100.
 */
export function calculateDailyProgressPercent(
  loggedPuffsToday: number,
  dailyCap: number,
): number {
  if (dailyCap <= 0) {
    return loggedPuffsToday === 0 ? 100 : 100;
  }

  return Math.min(100, Math.round((loggedPuffsToday / dailyCap) * 100));
}

/**
 * Builds supportive dashboard copy based on today's logged puffs.
 *
 * @param loggedPuffsToday - Puffs logged today.
 * @param dailyCap - Allowed daily cap.
 * @param quitPath - Selected quit path from onboarding.
 * @returns Plain-language status message.
 */
export function getDailyProgressMessage(
  loggedPuffsToday: number,
  dailyCap: number,
  quitPath: QuitPath | null,
): string {
  if (quitPath === 'abrupt') {
    return loggedPuffsToday === 0
      ? 'You have stayed vape-free today.'
      : `${loggedPuffsToday} puffs logged today. Tap Support if cravings feel tough.`;
  }

  if (dailyCap <= 0) {
    return 'Complete onboarding to set your daily target.';
  }

  if (loggedPuffsToday <= dailyCap) {
    return 'You are on track to meet your daily goal.';
  }

  return `You are ${loggedPuffsToday - dailyCap} puffs above today's target. Be kind to yourself and log cravings.`;
}

/**
 * Combines plan profile and today's tracking totals into dashboard progress.
 *
 * @param profile - User plan profile.
 * @param loggedPuffsToday - Total puffs logged today.
 * @param now - Reference time for tests.
 * @returns Daily plan progress for the home dashboard.
 */
export function buildDailyPlanProgress(
  profile: PlanProfile | null,
  loggedPuffsToday: number,
  now: Date = new Date(),
): DailyPlanProgress {
  const dailyCap = getDailyCapForPlan(profile, now);
  const quitPath = profile?.quitPath ?? null;

  return {
    dailyCap,
    loggedPuffsToday,
    progressPercent: calculateDailyProgressPercent(loggedPuffsToday, dailyCap),
    isWithinCap: isWithinDailyCap(loggedPuffsToday, dailyCap),
    statusMessage: getDailyProgressMessage(loggedPuffsToday, dailyCap, quitPath),
    weekIndex: calculateWeekIndexSinceStart(profile?.completedAt ?? null, now),
  };
}
