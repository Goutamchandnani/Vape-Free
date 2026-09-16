import { getFirestore } from 'firebase-admin/firestore';

const PARTICIPANT_COUNTER_ID = 'researchParticipants';

/**
 * Allocates the next pseudonymised participant id using a Firestore counter.
 *
 * @returns Participant id in P-0001 format.
 */
async function allocateParticipantId(): Promise<string> {
  const counterRef = getFirestore().collection('counters').doc(PARTICIPANT_COUNTER_ID);

  const participantId = await getFirestore().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(counterRef);
    const nextValue = snapshot.exists ? (snapshot.data()?.nextValue as number) + 1 : 1;

    transaction.set(counterRef, { nextValue }, { merge: true });

    return `P-${String(nextValue).padStart(4, '0')}`;
  });

  return participantId;
}

/**
 * Ensures a pseudonymised research profile exists for the authenticated user.
 * Identity mapping lives in researchProfiles; behavioural data stays under users/{uid}.
 *
 * @param userId - Firebase Auth UID.
 * @returns Assigned participant id.
 */
export async function ensureResearchProfile(userId: string): Promise<string> {
  const userRef = getFirestore().collection('users').doc(userId);
  const userSnapshot = await userRef.get();
  const existingParticipantId = userSnapshot.data()?.participantId as string | undefined;

  if (existingParticipantId) {
    return existingParticipantId;
  }

  const existingMapping = await getFirestore()
    .collection('researchProfiles')
    .where('authUid', '==', userId)
    .limit(1)
    .get();

  if (!existingMapping.empty) {
    const participantId = existingMapping.docs[0].id;
    await userRef.set({ participantId, updatedAt: new Date().toISOString() }, { merge: true });
    return participantId;
  }

  const participantId = await allocateParticipantId();
  const now = new Date().toISOString();

  const batch = getFirestore().batch();
  batch.set(getFirestore().collection('researchProfiles').doc(participantId), {
    participantId,
    authUid: userId,
    createdAt: now,
  });
  batch.set(userRef, { participantId, updatedAt: now }, { merge: true });

  await batch.commit();
  return participantId;
}
