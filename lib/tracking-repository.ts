import { FIRESTORE_COLLECTIONS, USER_SUBCOLLECTIONS } from '@/constants/firestore-collections';
import { ensureAnonymousAuth } from '@/lib/auth-service';
import {
  buildCravingLog,
  buildVapingSessionLog,
  type CreateCravingLogInput,
  type CreateVapingSessionInput,
} from '@/lib/build-tracking-log';
import { getFirebaseFirestore } from '@/lib/firebase-client';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from '@/lib/firebase-native';
import { getLocalDayStartIso, getStartOfLocalDayIso, sumPuffCounts } from '@/lib/tracking-utils';
import type { CravingLog, VapingSessionLog } from '@/types';

export interface TodayTrackingSummary {
  puffCountToday: number;
  cravingCountToday: number;
  sessionsToday: VapingSessionLog[];
  cravingsToday: CravingLog[];
}

/**
 * Persists a single-puff or multi-puff vaping session for the signed-in user.
 *
 * @param input - Session details excluding user id.
 * @returns Saved session document.
 */
export async function saveVapingSession(
  input: Omit<CreateVapingSessionInput, 'userId'>,
): Promise<VapingSessionLog> {
  const user = await ensureAnonymousAuth();
  const session = buildVapingSessionLog({ ...input, userId: user.uid });
  const sessionRef = doc(
    getFirebaseFirestore(),
    FIRESTORE_COLLECTIONS.users,
    user.uid,
    USER_SUBCOLLECTIONS.vapingSessions,
    session.id,
  );

  await setDoc(sessionRef, session);
  return session;
}

/**
 * Persists a craving log for the signed-in user.
 *
 * @param input - Craving details excluding user id.
 * @returns Saved craving document.
 */
export async function saveCravingLog(
  input: Omit<CreateCravingLogInput, 'userId'>,
): Promise<CravingLog> {
  const user = await ensureAnonymousAuth();
  const craving = buildCravingLog({ ...input, userId: user.uid });
  const cravingRef = doc(
    getFirebaseFirestore(),
    FIRESTORE_COLLECTIONS.users,
    user.uid,
    USER_SUBCOLLECTIONS.cravingLogs,
    craving.id,
  );

  await setDoc(cravingRef, craving);
  return craving;
}

/**
 * Loads today's vaping sessions and craving logs for the signed-in user.
 *
 * @returns Aggregated tracking summary for the current local day.
 */
export async function getTodayTrackingSummary(): Promise<TodayTrackingSummary> {
  const user = await ensureAnonymousAuth();
  const startOfDayIso = getStartOfLocalDayIso();
  const firestore = getFirebaseFirestore();

  const sessionsQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.users, user.uid, USER_SUBCOLLECTIONS.vapingSessions),
    where('loggedAt', '>=', startOfDayIso),
    orderBy('loggedAt', 'desc'),
  );

  const cravingsQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.users, user.uid, USER_SUBCOLLECTIONS.cravingLogs),
    where('loggedAt', '>=', startOfDayIso),
    orderBy('loggedAt', 'desc'),
  );

  const [sessionsSnapshot, cravingsSnapshot] = await Promise.all([
    getDocs(sessionsQuery),
    getDocs(cravingsQuery),
  ]);

  const sessionsToday = sessionsSnapshot.docs.map(
    (snapshot) => snapshot.data() as VapingSessionLog,
  );
  const cravingsToday = cravingsSnapshot.docs.map((snapshot) => snapshot.data() as CravingLog);

  return {
    puffCountToday: sumPuffCounts(sessionsToday),
    cravingCountToday: cravingsToday.length,
    sessionsToday,
    cravingsToday,
  };
}

export interface HistoricalTrackingSummary {
  sessions: VapingSessionLog[];
  cravings: CravingLog[];
}

/**
 * Loads vaping sessions and craving logs from a local-day start timestamp onward.
 *
 * @param startIso - Inclusive lower bound for loggedAt queries.
 * @returns Historical tracking documents for progress visualisation.
 */
export async function getHistoricalTrackingSummary(
  startIso: string,
): Promise<HistoricalTrackingSummary> {
  const user = await ensureAnonymousAuth();
  const firestore = getFirebaseFirestore();

  const sessionsQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.users, user.uid, USER_SUBCOLLECTIONS.vapingSessions),
    where('loggedAt', '>=', startIso),
    orderBy('loggedAt', 'desc'),
  );

  const cravingsQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.users, user.uid, USER_SUBCOLLECTIONS.cravingLogs),
    where('loggedAt', '>=', startIso),
    orderBy('loggedAt', 'desc'),
  );

  const [sessionsSnapshot, cravingsSnapshot] = await Promise.all([
    getDocs(sessionsQuery),
    getDocs(cravingsQuery),
  ]);

  return {
    sessions: sessionsSnapshot.docs.map((snapshot) => snapshot.data() as VapingSessionLog),
    cravings: cravingsSnapshot.docs.map((snapshot) => snapshot.data() as CravingLog),
  };
}

/**
 * Loads the last fourteen local days of tracking data for charts and milestones.
 *
 * @returns Sessions and cravings used by the progress screen.
 */
export async function getProgressTrackingSummary(): Promise<HistoricalTrackingSummary> {
  const startIso = getLocalDayStartIso(-13);
  return getHistoricalTrackingSummary(startIso);
}
