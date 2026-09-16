/**
 * Returns a stable local-date key for grouping session logs.
 *
 * @param isoTimestamp - ISO timestamp to normalise.
 * @returns YYYY-MM-DD in the device local timezone.
 */
export function getLocalDateKey(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns ISO midnight for a local day offset from today.
 *
 * @param dayOffset - 0 for today, -1 for yesterday.
 * @param now - Reference time for deterministic tests.
 * @returns ISO string at local midnight.
 */
export function getLocalDayStartIso(dayOffset: number, now: Date = new Date()): string {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + dayOffset);
  return start.toISOString();
}

/**
 * Returns the ISO timestamp for the start of the current local day.
 *
 * @param now - Reference time, injectable for deterministic tests.
 * @returns ISO string at local midnight.
 */
export function getStartOfLocalDayIso(now: Date = new Date()): string {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay.toISOString();
}

/**
 * Creates a stable-enough client-side document id for offline-first writes.
 *
 * @returns Unique document id string.
 */
export function createTrackingDocumentId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Sums puff counts from session logs.
 *
 * @param sessions - Vaping session documents with puff counts.
 * @returns Total puffs logged today.
 */
export function sumPuffCounts(sessions: { puffCount: number }[]): number {
  return sessions.reduce((total, session) => total + session.puffCount, 0);
}
