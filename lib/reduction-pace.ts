import { calculateGradualReductionCap } from '@/lib/reduction-algorithm';
import type { QuitPath, ReductionPace } from '@/types';

export type { ReductionPace };

export const REDUCTION_PACE_FACTORS: Record<ReductionPace, number> = {
  gentle: 0.9,
  steady: 0.8,
};

export const REDUCTION_PACE_LABELS: Record<ReductionPace, string> = {
  gentle: '10% reduction per week',
  steady: '20% reduction per week',
};

/**
 * Returns the weekly multiplier for a selected reduction pace.
 *
 * @param pace - Gentle or steady gradual reduction option.
 * @returns Multiplier applied each week (for example 0.9 for gentle).
 */
export function getWeeklyReductionFactor(pace: ReductionPace): number {
  return REDUCTION_PACE_FACTORS[pace];
}

/**
 * Calculates the first-week daily puff target shown at the end of onboarding.
 *
 * @param baselineDailyPuffs - User-reported typical daily puff count.
 * @param pace - Selected gradual reduction pace.
 * @returns Recommended maximum puffs for the first reduction week.
 */
export function calculateFirstWeekTarget(
  baselineDailyPuffs: number,
  pace: ReductionPace,
): number {
  return calculateGradualReductionCap(
    baselineDailyPuffs,
    1,
    5,
    getWeeklyReductionFactor(pace),
  );
}

export interface OnboardingSelection {
  quitPath: QuitPath;
  reductionPace: ReductionPace | null;
  dailyBaselinePuffs: number;
}

/**
 * Derives the starting daily target from onboarding selections.
 *
 * @param selection - Quit path, optional pace, and baseline puff count.
 * @returns Daily puff target for the first week of the plan.
 */
export function calculateStartingDailyTarget(selection: OnboardingSelection): number {
  if (selection.quitPath === 'abrupt') {
    return 0;
  }

  if (!selection.reductionPace) {
    return selection.dailyBaselinePuffs;
  }

  return calculateFirstWeekTarget(selection.dailyBaselinePuffs, selection.reductionPace);
}
