/** Mood tags selectable when writing a journal entry. */
export const JOURNAL_MOOD_TAGS = [
  { id: 'calm', label: 'Calm' },
  { id: 'hopeful', label: 'Hopeful' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'proud', label: 'Proud' },
  { id: 'tired', label: 'Tired' },
] as const;

export type JournalMoodTagId = (typeof JOURNAL_MOOD_TAGS)[number]['id'];
