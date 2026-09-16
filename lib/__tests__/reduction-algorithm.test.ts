import { calculateGradualReductionCap, isWithinDailyCap } from '@/lib/reduction-algorithm';

describe('reduction-algorithm', () => {
  describe('calculateGradualReductionCap', () => {
    it('returns baseline in week zero', () => {
      expect(calculateGradualReductionCap(100, 0)).toBe(100);
    });

    it('applies weekly reduction factor', () => {
      expect(calculateGradualReductionCap(100, 1)).toBe(90);
      expect(calculateGradualReductionCap(100, 2)).toBe(81);
    });

    it('respects the minimum daily puff floor', () => {
      expect(calculateGradualReductionCap(10, 10, 5)).toBe(5);
    });

    it('returns the floor for invalid baseline input', () => {
      expect(calculateGradualReductionCap(0, 0)).toBe(5);
    });
  });

  describe('isWithinDailyCap', () => {
    it('returns true when logged puffs are within cap', () => {
      expect(isWithinDailyCap(20, 25)).toBe(true);
    });

    it('returns false when logged puffs exceed cap', () => {
      expect(isWithinDailyCap(26, 25)).toBe(false);
    });
  });
});
