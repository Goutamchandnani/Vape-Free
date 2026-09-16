import {
  getLocalDateKey,
  getLocalDayStartIso,
  sumPuffCounts,
} from '@/lib/tracking-utils';
import type { VapingSessionLog } from '@/types';

export interface DailyPuffPoint {
  dateKey: string;
  label: string;
  puffCount: number;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export { getLocalDateKey, getLocalDayStartIso };

/**
 * Builds a fixed-length daily puff series ending on the reference day.
 *
 * @param sessions - Vaping sessions within the requested window.
 * @param days - Number of days to include, oldest first.
 * @param now - Reference time for deterministic tests.
 * @returns Ordered daily puff totals with short weekday labels.
 */
export function buildDailyPuffSeries(
  sessions: VapingSessionLog[],
  days: number,
  now: Date = new Date(),
): DailyPuffPoint[] {
  const totalsByDate = new Map<string, number>();

  for (const session of sessions) {
    const dateKey = getLocalDateKey(session.loggedAt);

    if (!dateKey) {
      continue;
    }

    totalsByDate.set(dateKey, (totalsByDate.get(dateKey) ?? 0) + session.puffCount);
  }

  const series: DailyPuffPoint[] = [];

  for (let offset = -(days - 1); offset <= 0; offset += 1) {
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() + offset);

    const dateKey = getLocalDateKey(dayStart.toISOString());
    const label =
      offset === 0 ? 'Today' : DAY_LABELS[dayStart.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];

    series.push({
      dateKey,
      label,
      puffCount: totalsByDate.get(dateKey) ?? 0,
    });
  }

  return series;
}

/**
 * Calculates week-over-week puff change for the most recent seven-day window.
 *
 * @param sessions - Sessions covering at least the last fourteen days.
 * @param now - Reference time for deterministic tests.
 * @returns Percentage change rounded to the nearest whole number, or null when prior week had no puffs.
 */
export function calculateWeekOverWeekChange(
  sessions: VapingSessionLog[],
  now: Date = new Date(),
): number | null {
  const currentWeek = buildDailyPuffSeries(sessions, 7, now);
  const previousWeekStart = new Date(now);
  previousWeekStart.setHours(0, 0, 0, 0);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const previousWeek = buildDailyPuffSeries(sessions, 7, previousWeekStart);
  const currentTotal = sumPuffCounts(currentWeek);
  const previousTotal = sumPuffCounts(previousWeek);

  if (previousTotal === 0) {
    return currentTotal === 0 ? 0 : null;
  }

  return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
}
