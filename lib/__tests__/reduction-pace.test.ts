import {
  calculateFirstWeekTarget,
  calculateStartingDailyTarget,
  getWeeklyReductionFactor,
} from '@/lib/reduction-pace';

describe('reduction pace', () => {
  it('maps gentle and steady paces to weekly factors', () => {
    expect(getWeeklyReductionFactor('gentle')).toBe(0.9);
    expect(getWeeklyReductionFactor('steady')).toBe(0.8);
  });

  it('calculates the first week target from baseline puffs', () => {
    expect(calculateFirstWeekTarget(150, 'gentle')).toBe(135);
    expect(calculateFirstWeekTarget(150, 'steady')).toBe(120);
  });

  it('returns zero for abrupt quit selections', () => {
    expect(
      calculateStartingDailyTarget({
        quitPath: 'abrupt',
        reductionPace: null,
        dailyBaselinePuffs: 150,
      }),
    ).toBe(0);
  });
});
