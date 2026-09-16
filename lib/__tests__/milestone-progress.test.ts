import { calculateZeroPuffStreak, formatMilestoneProgressLabel } from '@/lib/milestone-progress';
import { evaluateMilestones } from '@/lib/milestones';
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

describe('milestone-progress', () => {
  const now = new Date('2026-09-06T12:00:00.000Z');

  describe('calculateZeroPuffStreak', () => {
    it('counts consecutive zero-puff days ending today', () => {
      const sessions = [
        createSession('2026-09-04T10:00:00.000Z', 5),
        createSession('2026-09-05T10:00:00.000Z', 0),
      ];

      expect(calculateZeroPuffStreak(sessions, 7, now)).toBe(2);
    });
  });

  describe('formatMilestoneProgressLabel', () => {
    it('formats money milestones in GBP', () => {
      expect(formatMilestoneProgressLabel('money', 12.5, 20)).toBe('£12 / £20');
    });
  });
});

describe('milestones evaluateMilestones extended catalog', () => {
  const now = new Date('2026-09-06T12:00:00.000Z');

  it('unlocks early engagement milestones from minimal activity', () => {
    const statuses = evaluateMilestones({
      streakDays: 1,
      dailyBaselinePuffs: 100,
      sessions: [],
      cravings: [
        {
          id: 'c1',
          userId: 'user-1',
          intensity: 3,
          triggerTags: [],
          notes: null,
          resisted: true,
          loggedAt: '2026-09-06T10:00:00.000Z',
          createdAt: '2026-09-06T10:00:00.000Z',
          updatedAt: '2026-09-06T10:00:00.000Z',
          isPendingSync: false,
        },
      ],
      now,
    });

    expect(statuses.find((milestone) => milestone.id === 'first-resist')?.isUnlocked).toBe(true);
    expect(statuses.find((milestone) => milestone.id === 'clean-slate')?.isUnlocked).toBe(true);
  });
});
