import {
  buildDailyPuffSeries,
  calculateWeekOverWeekChange,
} from '@/lib/progress-chart';
import type { VapingSessionLog } from '@/types';

function createSession(loggedAt: string, puffCount: number): VapingSessionLog {
  return {
    id: `session-${loggedAt}`,
    userId: 'user-1',
    puffCount,
    nicotineMg: null,
    notes: null,
    loggedAt,
    createdAt: loggedAt,
    updatedAt: loggedAt,
    isPendingSync: false,
  };
}

describe('progress-chart', () => {
  const now = new Date('2026-09-06T15:00:00.000Z');

  describe('buildDailyPuffSeries', () => {
    it('returns seven daily points ending on today', () => {
      const series = buildDailyPuffSeries([], 7, now);

      expect(series).toHaveLength(7);
      expect(series.at(-1)?.label).toBe('Today');
    });

    it('aggregates puff counts by local day', () => {
      const sessions = [
        createSession('2026-09-06T10:00:00.000Z', 3),
        createSession('2026-09-06T18:00:00.000Z', 2),
        createSession('2026-09-05T09:00:00.000Z', 10),
      ];

      const series = buildDailyPuffSeries(sessions, 7, now);

      expect(series.at(-1)?.puffCount).toBe(5);
      expect(series.at(-2)?.puffCount).toBe(10);
    });
  });

  describe('calculateWeekOverWeekChange', () => {
    it('returns negative change when recent week has fewer puffs', () => {
      const sessions = [
        createSession('2026-08-24T10:00:00.000Z', 20),
        createSession('2026-08-25T10:00:00.000Z', 20),
        createSession('2026-09-01T10:00:00.000Z', 10),
        createSession('2026-09-02T10:00:00.000Z', 10),
      ];

      expect(calculateWeekOverWeekChange(sessions, now)).toBe(-50);
    });

    it('returns null when the prior week had zero puffs but current week did not', () => {
      const sessions = [createSession('2026-09-06T10:00:00.000Z', 5)];

      expect(calculateWeekOverWeekChange(sessions, now)).toBeNull();
    });
  });
});
