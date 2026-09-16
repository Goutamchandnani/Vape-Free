import { applyJournalEntryUpdate } from '@/lib/journal-mutations';
import type { JournalEntry } from '@/types';

describe('journal-mutations', () => {
  const entry: JournalEntry = {
    id: 'entry-1',
    userId: 'user-1',
    body: 'Original reflection',
    moodTag: 'calm',
    loggedAt: '2026-09-06T10:00:00.000Z',
    createdAt: '2026-09-06T10:00:00.000Z',
    updatedAt: '2026-09-06T10:00:00.000Z',
    isPendingSync: false,
  };

  it('trims updated journal text and preserves document identity', () => {
    const updated = applyJournalEntryUpdate(entry, {
      body: '  Updated reflection  ',
      moodTag: 'hopeful',
    });

    expect(updated).toMatchObject({
      id: 'entry-1',
      body: 'Updated reflection',
      moodTag: 'hopeful',
    });
    expect(updated.updatedAt).not.toBe(entry.updatedAt);
  });
});
