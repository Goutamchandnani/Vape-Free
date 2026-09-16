import { calculateStreakDays, hasReachedMilestone } from '@/lib/streak-calculator';

describe('streak-calculator', () => {
  describe('calculateStreakDays', () => {
    it('returns zero when quit has not started', () => {
      expect(calculateStreakDays(null)).toBe(0);
    });

    it('returns zero for future quit dates', () => {
      const future = new Date('2099-01-01T00:00:00.000Z').toISOString();
      expect(calculateStreakDays(future, new Date('2026-01-01T00:00:00.000Z'))).toBe(0);
    });

    it('counts whole days since quit start', () => {
      const start = new Date('2026-01-01T00:00:00.000Z').toISOString();
      const now = new Date('2026-01-04T12:00:00.000Z');
      expect(calculateStreakDays(start, now)).toBe(3);
    });
  });

  describe('hasReachedMilestone', () => {
    it('returns true when streak meets milestone', () => {
      expect(hasReachedMilestone(7, 7)).toBe(true);
      expect(hasReachedMilestone(10, 7)).toBe(true);
    });

    it('returns false when streak is below milestone', () => {
      expect(hasReachedMilestone(3, 7)).toBe(false);
    });
  });
});
