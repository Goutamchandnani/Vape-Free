import { pickReframeTip } from '@/constants/reframe-tips';

describe('reframe-tips', () => {
  it('returns a deterministic tip when index is provided', () => {
    expect(pickReframeTip(0)).toBeTruthy();
    expect(pickReframeTip(0)).toBe(pickReframeTip(0));
  });
});
