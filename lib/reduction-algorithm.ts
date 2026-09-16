/**
 * Computes the next daily puff cap for the gradual reduction path.
 * The 10 percent weekly reduction rate follows common behavioural smoking cessation
 * taper guidance used as a dissertation baseline (see dissertation methods chapter).
 *
 * @param baselineDailyPuffs - User-reported typical daily puff count at onboarding.
 * @param weekIndex - Zero-based week number since reduction began.
 * @param minimumDailyPuffs - Floor to avoid impractically small daily targets.
 * @returns Recommended maximum puffs for the given week.
 */
export function calculateGradualReductionCap(
  baselineDailyPuffs: number,
  weekIndex: number,
  minimumDailyPuffs = 5,
  weeklyReductionFactor = 0.9,
): number {
  if (baselineDailyPuffs <= 0 || weekIndex < 0) {
    return minimumDailyPuffs;
  }

  const reduced = baselineDailyPuffs * weeklyReductionFactor ** weekIndex;
  return Math.max(minimumDailyPuffs, Math.round(reduced));
}

/**
 * Returns whether today's logged puffs remain within the gradual reduction cap.
 *
 * @param loggedPuffsToday - Total puffs logged for the current local day.
 * @param dailyCap - Allowed daily cap from the reduction algorithm.
 * @returns True when the user is within plan limits.
 */
export function isWithinDailyCap(loggedPuffsToday: number, dailyCap: number): boolean {
  return loggedPuffsToday <= dailyCap;
}
