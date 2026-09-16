import { buildJournalEntry } from '@/lib/build-journal-entry';

describe('buildJournalEntry', () => {
  it('normalises journal input into a user-owned Firestore document', () => {
    const entry = buildJournalEntry({
      userId: 'user-123',
      body: '  Today felt manageable.  ',
      moodTag: 'hopeful',
      loggedAt: '2026-09-06T12:00:00.000Z',
    });

    expect(entry).toMatchObject({
      userId: 'user-123',
      body: 'Today felt manageable.',
      moodTag: 'hopeful',
      loggedAt: '2026-09-06T12:00:00.000Z',
      isPendingSync: false,
    });
    expect(entry.id.length).toBeGreaterThan(0);
  });
});
