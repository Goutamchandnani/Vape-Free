import { buildDailyPuffSeries } from '@/lib/progress-chart';
import type { VapingSessionLog } from '@/types';

/**
 * Counts consecutive zero-puff days ending on the reference day.
 *
 * @param sessions - Vaping sessions within the lookback window.
 * @param lookbackDays - Number of recent days to inspect.
 * @param now - Reference time for deterministic tests.
 * @returns Current zero-puff streak length in whole days.
 */
export function calculateZeroPuffStreak(
  sessions: VapingSessionLog[],
  lookbackDays = 30,
  now: Date = new Date(),
): number {
  const series = buildDailyPuffSeries(sessions, lookbackDays, now);
  let streak = 0;

  for (let index = series.length - 1; index >= 0; index -= 1) {
    if (series[index]?.puffCount !== 0) {
      break;
    }

    streak += 1;
  }

  return streak;
}

/**
 * Formats locked-milestone progress for display on progress cards.
 *
 * @param kind - Milestone unlock category.
 * @param progressValue - Current progress toward the threshold.
 * @param threshold - Target value required to unlock.
 * @returns Short progress label such as "3/7 days".
 */
export function formatMilestoneProgressLabel(
  kind: string,
  progressValue: number,
  threshold: number,
): string {
  const progress = Math.min(progressValue, threshold);

  switch (kind) {
    case 'money':
      return `£${Math.floor(progress)} / £${threshold}`;
    case 'reduction':
      return `${Math.floor(progress)}% / ${threshold}%`;
    case 'streak':
    case 'zero_puff_streak':
      return `${Math.floor(progress)} / ${threshold} days`;
    case 'cravings_resisted':
      return `${Math.floor(progress)} / ${threshold} resisted`;
    case 'cravings_logged':
      return `${Math.floor(progress)} / ${threshold} logged`;
    default:
      return `${Math.floor(progress)} / ${threshold}`;
  }
}
