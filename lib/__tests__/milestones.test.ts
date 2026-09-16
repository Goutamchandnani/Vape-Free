import { evaluateMilestones, estimateMoneySavedGbp } from '@/lib/milestones';
import type { CravingLog, VapingSessionLog } from '@/types';

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

function createCraving(loggedAt: string, resisted: boolean): CravingLog {
  return {
    id: `craving-${loggedAt}`,
    userId: 'user-1',
    intensity: 3,
    triggerTags: [],
    notes: null,
    resisted,
    loggedAt,
    createdAt: loggedAt,
    updatedAt: loggedAt,
    isPendingSync: false,
  };
}

describe('milestones', () => {
  const now = new Date('2026-09-06T12:00:00.000Z');

  describe('estimateMoneySavedGbp', () => {
    it('returns zero when baseline is missing', () => {
      expect(estimateMoneySavedGbp([], 0, now)).toBe(0);
    });

    it('estimates savings from avoided puffs', () => {
      const sessions = [createSession('2026-09-06T10:00:00.000Z', 50)];

      expect(estimateMoneySavedGbp(sessions, 100, now)).toBeGreaterThan(0);
    });
  });

  describe('evaluateMilestones', () => {
    it('unlocks streak and craving milestones from tracking data', () => {
      const statuses = evaluateMilestones({
        streakDays: 7,
        dailyBaselinePuffs: 100,
        sessions: [createSession('2026-09-06T10:00:00.000Z', 40)],
        cravings: [
          createCraving('2026-09-01T10:00:00.000Z', true),
          createCraving('2026-09-02T10:00:00.000Z', true),
          createCraving('2026-09-03T10:00:00.000Z', true),
          createCraving('2026-09-04T10:00:00.000Z', true),
          createCraving('2026-09-05T10:00:00.000Z', true),
        ],
        now,
      });

      expect(statuses.find((milestone) => milestone.id === 'first-day')?.isUnlocked).toBe(true);
      expect(statuses.find((milestone) => milestone.id === 'one-week')?.isUnlocked).toBe(true);
      expect(statuses.find((milestone) => milestone.id === 'deep-breath')?.isUnlocked).toBe(true);
      expect(statuses.find((milestone) => milestone.id === 'three-day-spark')?.isUnlocked).toBe(true);
    });
  });
});
