import {
  buildDailyPlanProgress,
  calculateWeekIndexSinceStart,
  getDailyCapForPlan,
  getDailyProgressMessage,
} from '@/lib/daily-plan-progress';
import type { PlanProfile } from '@/lib/plan-profile';

const profile: PlanProfile = {
  quitPath: 'gradual',
  reductionPace: 'gentle',
  dailyBaselinePuffs: 150,
  startingDailyTarget: 135,
  onboardingCompleted: true,
  completedAt: '2026-09-06T00:00:00.000Z',
};

describe('daily plan progress', () => {
  it('calculates week index from onboarding completion date', () => {
    const now = new Date('2026-09-13T12:00:00.000Z');
    expect(calculateWeekIndexSinceStart('2026-09-06T00:00:00.000Z', now)).toBe(1);
  });

  it('uses the starting daily target during week zero', () => {
    const now = new Date('2026-09-06T12:00:00.000Z');
    expect(getDailyCapForPlan(profile, now)).toBe(135);
  });

  it('builds on-track progress when puffs remain within cap', () => {
    const progress = buildDailyPlanProgress(profile, 40, new Date('2026-09-06T15:00:00.000Z'));

    expect(progress).toMatchObject({
      dailyCap: 135,
      loggedPuffsToday: 40,
      isWithinCap: true,
      progressPercent: 30,
    });
    expect(progress.statusMessage).toContain('on track');
  });

  it('supports abrupt quit messaging when no puffs are logged', () => {
    const abruptProfile: PlanProfile = {
      ...profile,
      quitPath: 'abrupt',
      startingDailyTarget: 0,
    };

    expect(getDailyProgressMessage(0, 0, abruptProfile.quitPath)).toContain('vape-free');
  });
});
