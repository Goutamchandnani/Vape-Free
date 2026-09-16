import { getFirebaseFunctions } from '@/lib/firebase-client';
import { httpsCallable } from '@/lib/firebase-native';

interface EnsureResearchProfileResponse {
  participantId: string;
}

/**
 * Ensures the signed-in user has a pseudonymised research profile via Cloud Function.
 *
 * @returns Assigned participant id.
 */
export async function ensureResearchProfile(): Promise<string> {
  const functions = getFirebaseFunctions();
  const ensureProfile = httpsCallable<undefined, EnsureResearchProfileResponse>(
    functions,
    'ensureResearchProfileCallable',
  );

  const result = await ensureProfile();
  return result.data.participantId;
}
