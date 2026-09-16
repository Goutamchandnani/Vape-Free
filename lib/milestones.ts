import { MILESTONE_DEFINITIONS, PUFF_COST_GBP, type MilestoneDefinition } from '@/constants/milestones';
import { calculateZeroPuffStreak } from '@/lib/milestone-progress';
import { buildDailyPuffSeries } from '@/lib/progress-chart';
import { hasReachedMilestone } from '@/lib/streak-calculator';
import type { CravingLog, VapingSessionLog } from '@/types';

export type { MilestoneDefinition } from '@/constants/milestones';
export type MilestoneKind = MilestoneDefinition['kind'];

export interface MilestoneStatus extends MilestoneDefinition {
  isUnlocked: boolean;
  progressValue: number;
}

export interface MilestoneProgressInput {
  streakDays: number;
  dailyBaselinePuffs: number;
  sessions: VapingSessionLog[];
  cravings: CravingLog[];
  now?: Date;
}

/**
 * Estimates money saved from avoided puffs since onboarding began.
 *
 * @param sessions - Historical vaping sessions.
 * @param dailyBaselinePuffs - Pre-quit daily baseline from onboarding.
 * @param now - Reference time for deterministic tests.
 * @returns Estimated savings in GBP.
 */
export function estimateMoneySavedGbp(
  sessions: VapingSessionLog[],
  dailyBaselinePuffs: number,
  now: Date = new Date(),
): number {
  if (dailyBaselinePuffs <= 0) {
    return 0;
  }

  const dailySeries = buildDailyPuffSeries(sessions, 30, now);
  const avoidedPuffs = dailySeries.reduce((total, day) => {
    return total + Math.max(0, dailyBaselinePuffs - day.puffCount);
  }, 0);

  return Number((avoidedPuffs * PUFF_COST_GBP).toFixed(2));
}

/**
 * Calculates average reduction versus baseline across the last seven days.
 *
 * @param sessions - Vaping sessions for the recent window.
 * @param dailyBaselinePuffs - Pre-quit daily baseline from onboarding.
 * @param now - Reference time for deterministic tests.
 * @returns Whole-number reduction percentage, clamped at zero.
 */
export function calculateRecentReductionPercent(
  sessions: VapingSessionLog[],
  dailyBaselinePuffs: number,
  now: Date = new Date(),
): number {
  if (dailyBaselinePuffs <= 0) {
    return 0;
  }

  const recentSeries = buildDailyPuffSeries(sessions, 7, now);
  const recentAverage =
    recentSeries.reduce((total, day) => total + day.puffCount, 0) / recentSeries.length;
  const reduction = ((dailyBaselinePuffs - recentAverage) / dailyBaselinePuffs) * 100;

  return Math.max(0, Math.round(reduction));
}

/**
 * Evaluates milestone unlock state from profile and tracking data.
 *
 * @param input - Streak, baseline, and historical tracking documents.
 * @returns Milestone statuses in catalog order.
 */
export function evaluateMilestones(input: MilestoneProgressInput): MilestoneStatus[] {
  const now = input.now ?? new Date();
  const resistedCravings = input.cravings.filter((craving) => craving.resisted).length;
  const cravingsLogged = input.cravings.length;
  const zeroPuffStreak = calculateZeroPuffStreak(input.sessions, 30, now);
  const moneySaved = estimateMoneySavedGbp(input.sessions, input.dailyBaselinePuffs, now);
  const reductionPercent = calculateRecentReductionPercent(
    input.sessions,
    input.dailyBaselinePuffs,
    now,
  );

  return MILESTONE_DEFINITIONS.map((milestone) => {
    let progressValue = 0;
    let isUnlocked = false;

    switch (milestone.kind) {
      case 'streak':
        progressValue = input.streakDays;
        isUnlocked = hasReachedMilestone(input.streakDays, milestone.threshold);
        break;
      case 'money':
        progressValue = moneySaved;
        isUnlocked = moneySaved >= milestone.threshold;
        break;
      case 'cravings_resisted':
        progressValue = resistedCravings;
        isUnlocked = resistedCravings >= milestone.threshold;
        break;
      case 'reduction':
        progressValue = reductionPercent;
        isUnlocked = reductionPercent >= milestone.threshold;
        break;
      case 'zero_puff_streak':
        progressValue = zeroPuffStreak;
        isUnlocked = zeroPuffStreak >= milestone.threshold;
        break;
      case 'cravings_logged':
        progressValue = cravingsLogged;
        isUnlocked = cravingsLogged >= milestone.threshold;
        break;
    }

    return {
      ...milestone,
      isUnlocked,
      progressValue,
    };
  });
}
