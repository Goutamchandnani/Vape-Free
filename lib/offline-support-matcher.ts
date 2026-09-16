import {
  OFFLINE_SUPPORT_INTENTS,
  type OfflineSupportIntent,
  type OfflineSupportIntentDefinition,
} from '@/constants/offline-support';
import {
  CRISIS_RESPONSE,
  detectCrisisLanguage,
  detectMedicalAdviceRequest,
  MEDICAL_RESPONSE,
} from '@/lib/chat-safety';

export interface OfflineSupportMatch {
  intent: OfflineSupportIntent;
  response: string;
  safetyFlags: {
    hasCrisisLanguage: boolean;
    hasMedicalAdviceRequest: boolean;
  };
}

/**
 * Picks a deterministic response for tests or a pseudo-random one at runtime.
 *
 * @param responses - Candidate supportive replies.
 * @param seed - Optional seed derived from user text length.
 * @returns Selected response string.
 */
export function pickOfflineSupportResponse(
  responses: readonly string[],
  seed = 0,
): string {
  if (responses.length === 0) {
    return OFFLINE_SUPPORT_INTENTS[OFFLINE_SUPPORT_INTENTS.length - 1]?.responses[0] ?? '';
  }

  return responses[seed % responses.length] ?? responses[0];
}

function findIntentDefinition(message: string): OfflineSupportIntentDefinition {
  for (const intent of OFFLINE_SUPPORT_INTENTS) {
    if (intent.id === 'general') {
      continue;
    }

    if (intent.patterns.some((pattern) => pattern.test(message))) {
      return intent;
    }
  }

  return OFFLINE_SUPPORT_INTENTS[OFFLINE_SUPPORT_INTENTS.length - 1];
}

/**
 * Maps a user message to a safe offline supportive reply.
 *
 * @param message - Raw user message text.
 * @returns Intent, response copy, and safety flags for UI badges.
 */
export function matchOfflineSupportMessage(message: string): OfflineSupportMatch {
  const trimmed = message.trim();
  const hasCrisisLanguage = detectCrisisLanguage(trimmed);
  const hasMedicalAdviceRequest = detectMedicalAdviceRequest(trimmed);
  const safetyFlags = { hasCrisisLanguage, hasMedicalAdviceRequest };

  if (hasCrisisLanguage) {
    return {
      intent: 'general',
      response: CRISIS_RESPONSE,
      safetyFlags,
    };
  }

  if (hasMedicalAdviceRequest) {
    return {
      intent: 'general',
      response: MEDICAL_RESPONSE,
      safetyFlags,
    };
  }

  const intentDefinition = findIntentDefinition(trimmed);

  return {
    intent: intentDefinition.id,
    response: pickOfflineSupportResponse(intentDefinition.responses, trimmed.length),
    safetyFlags,
  };
}
