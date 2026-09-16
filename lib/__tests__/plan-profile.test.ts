import { getPlanSummary, toPlanProfile } from '@/lib/plan-profile';

describe('plan profile helpers', () => {
  it('summarises gradual plans with pace and starting target', () => {
    const profile = toPlanProfile({
      quitPath: 'gradual',
      reductionPace: 'steady',
      dailyBaselinePuffs: 150,
      startingDailyTarget: 120,
      targetQuitDate: null,
      onboardingCompleted: true,
      completedAt: '2026-09-06T12:00:00.000Z',
    });

    expect(getPlanSummary(profile)).toBe(
      '20% reduction per week. Starting target: 120 puffs per day.',
    );
  });

  it('summarises abrupt quit plans', () => {
    const profile = toPlanProfile({
      quitPath: 'abrupt',
      reductionPace: null,
      dailyBaselinePuffs: 150,
      startingDailyTarget: 0,
      targetQuitDate: '2026-09-06T12:00:00.000Z',
      onboardingCompleted: true,
      completedAt: '2026-09-06T12:00:00.000Z',
    });

    expect(getPlanSummary(profile)).toBe(
      'Abrupt quit path. Focus on craving support and daily check-ins.',
    );
  });
});
