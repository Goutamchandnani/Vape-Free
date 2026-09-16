import { initializeApp } from 'firebase-admin/app';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

import { getRecentChatTurns, persistChatExchange, reportAssistantMessage } from './chat-message-repository';
import { generateSupportReply } from './gemini-client';
import { ensureResearchProfile } from './research-profile-repository';
import {
  CRISIS_RESPONSE,
  detectCrisisLanguage,
  detectMedicalAdviceRequest,
  MEDICAL_RESPONSE,
} from './safety';

initializeApp();
setGlobalOptions({ region: 'europe-west2' });

const DEFAULT_CONVERSATION_ID = 'default-support';

export {
  detectCrisisLanguage,
  detectMedicalAdviceRequest,
} from './safety';

/**
 * Callable Cloud Function proxy for Gemini chat completion.
 * Gemini API keys remain server-side only, per dissertation security requirements.
 */
export const chatCompletion = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }

  const message = typeof request.data?.message === 'string' ? request.data.message : '';
  const conversationId =
    typeof request.data?.conversationId === 'string' && request.data.conversationId.trim().length > 0
      ? request.data.conversationId.trim()
      : DEFAULT_CONVERSATION_ID;

  if (!message.trim()) {
    throw new HttpsError('invalid-argument', 'A non-empty message is required.');
  }

  const userId = request.auth.uid;
  const hasCrisisLanguage = detectCrisisLanguage(message);
  const hasMedicalAdviceRequest = detectMedicalAdviceRequest(message);
  const safetyFlags = { hasCrisisLanguage, hasMedicalAdviceRequest };

  if (hasCrisisLanguage) {
    const messageId = await persistChatExchange({
      userId,
      conversationId,
      userMessage: message,
      assistantMessage: CRISIS_RESPONSE,
      safetyFlags,
    });

    return {
      messageId,
      content: CRISIS_RESPONSE,
      safetyFlags,
      crisisResourcesShown: true,
    };
  }

  if (hasMedicalAdviceRequest) {
    const messageId = await persistChatExchange({
      userId,
      conversationId,
      userMessage: message,
      assistantMessage: MEDICAL_RESPONSE,
      safetyFlags,
    });

    return {
      messageId,
      content: MEDICAL_RESPONSE,
      safetyFlags,
      crisisResourcesShown: false,
    };
  }

  try {
    const history = await getRecentChatTurns(userId, conversationId);
    const assistantContent = await generateSupportReply(history, message);
    const messageId = await persistChatExchange({
      userId,
      conversationId,
      userMessage: message,
      assistantMessage: assistantContent,
      safetyFlags,
    });

    return {
      messageId,
      content: assistantContent,
      safetyFlags,
      crisisResourcesShown: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Support chat failed.';
    throw new HttpsError('internal', errorMessage);
  }
});

/**
 * Callable endpoint for users to flag an inappropriate assistant response.
 * Chat message writes remain server-side per Firestore security rules.
 */
export const reportChatMessage = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }

  const messageId =
    typeof request.data?.messageId === 'string' ? request.data.messageId.trim() : '';
  const reason = typeof request.data?.reason === 'string' ? request.data.reason.trim() : '';

  if (!messageId) {
    throw new HttpsError('invalid-argument', 'A message id is required.');
  }

  if (!reason) {
    throw new HttpsError('invalid-argument', 'A report reason is required.');
  }

  try {
    await reportAssistantMessage(request.auth.uid, messageId, reason);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Could not report message.';
    throw new HttpsError('failed-precondition', errorMessage);
  }
});

/**
 * Creates or returns the pseudonymised participant id for the signed-in user.
 */
export const ensureResearchProfileCallable = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }

  try {
    const participantId = await ensureResearchProfile(request.auth.uid);
    return { participantId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Could not create research profile.';
    throw new HttpsError('internal', errorMessage);
  }
});
