import { buildCravingLog, buildVapingSessionLog } from '@/lib/build-tracking-log';
import { getStartOfLocalDayIso, sumPuffCounts } from '@/lib/tracking-utils';

describe('tracking utils', () => {
  it('returns local midnight as an ISO timestamp', () => {
    const reference = new Date('2026-09-06T15:30:00');
    const expected = new Date(reference);
    expected.setHours(0, 0, 0, 0);
    expect(getStartOfLocalDayIso(reference)).toBe(expected.toISOString());
  });

  it('sums puff counts from session logs', () => {
    expect(sumPuffCounts([{ puffCount: 1 }, { puffCount: 3 }, { puffCount: 2 }])).toBe(6);
  });
});

describe('build tracking logs', () => {
  it('builds a vaping session document with defaults', () => {
    const session = buildVapingSessionLog({
      userId: 'user-1',
      puffCount: 1,
      loggedAt: '2026-09-06T12:00:00.000Z',
    });

    expect(session).toMatchObject({
      userId: 'user-1',
      puffCount: 1,
      nicotineMg: null,
      loggedAt: '2026-09-06T12:00:00.000Z',
      isPendingSync: false,
    });
  });

  it('builds a craving log document with trigger tags', () => {
    const craving = buildCravingLog({
      userId: 'user-1',
      intensity: 4,
      triggerTags: ['Stress', 'Social'],
      resisted: true,
      loggedAt: '2026-09-06T12:05:00.000Z',
    });

    expect(craving).toMatchObject({
      userId: 'user-1',
      intensity: 4,
      triggerTags: ['Stress', 'Social'],
      resisted: true,
      loggedAt: '2026-09-06T12:05:00.000Z',
    });
  });
});
