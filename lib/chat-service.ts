import { DEFAULT_SUPPORT_CONVERSATION_ID } from '@/constants/chat';
import { FIRESTORE_COLLECTIONS, USER_SUBCOLLECTIONS } from '@/constants/firestore-collections';
import { ensureAnonymousAuth } from '@/lib/auth-service';
import { createAppError, toAppError } from '@/lib/create-app-error';
import { getFirebaseFirestore, getFirebaseFunctions } from '@/lib/firebase-client';
import { mergeChatMessages } from '@/lib/merge-chat-messages';
import {
  getOfflineChatMessages,
  sendOfflineSupportExchange,
} from '@/lib/offline-chat-repository';
import { getIsNetworkOnline } from '@/lib/network-status';
import { collection, getDocs, httpsCallable, orderBy, query, where } from '@/lib/firebase-native';
import type { ChatCompletionResponse, ChatMessage } from '@/types';

/**
 * Loads chat messages for the default support conversation.
 *
 * @param conversationId - Conversation identifier.
 * @returns Chronological chat messages for the signed-in user.
 */
export async function getSupportChatMessages(
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<ChatMessage[]> {
  const user = await ensureAnonymousAuth();
  const messagesQuery = query(
    collection(
      getFirebaseFirestore(),
      FIRESTORE_COLLECTIONS.users,
      user.uid,
      USER_SUBCOLLECTIONS.chatMessages,
    ),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc'),
  );

  const snapshot = await getDocs(messagesQuery);

  return snapshot.docs.map((document) => {
    const message = document.data() as ChatMessage;
    return {
      ...message,
      supportSource: message.supportSource ?? 'cloud',
    };
  });
}

/**
 * Loads cloud and offline companion messages merged chronologically.
 *
 * @param conversationId - Conversation identifier.
 * @returns Combined chat history for the signed-in user.
 */
export async function getAllSupportChatMessages(
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<ChatMessage[]> {
  const user = await ensureAnonymousAuth();
  let cloudMessages: ChatMessage[] = [];

  try {
    cloudMessages = await getSupportChatMessages(conversationId);
  } catch (error) {
    const appError = toAppError(error);

    if (appError.code !== 'network_unavailable' && appError.code !== 'chat_failed') {
      throw error;
    }
  }

  const offlineMessages = await getOfflineChatMessages(user.uid, conversationId);
  return mergeChatMessages(cloudMessages, offlineMessages);
}

/**
 * Sends a support message via Gemini when online, otherwise the offline companion.
 *
 * @param message - User message text.
 * @param conversationId - Conversation identifier.
 * @returns Cloud response metadata or offline exchange marker.
 */
export async function sendSupportMessage(
  message: string,
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<{ mode: 'cloud' | 'offline_companion'; response?: ChatCompletionResponse }> {
  const user = await ensureAnonymousAuth();
  const isOnline = await getIsNetworkOnline();

  if (!isOnline) {
    await sendOfflineSupportExchange(user.uid, message, conversationId);
    return { mode: 'offline_companion' };
  }

  try {
    const response = await sendSupportChatMessage(message, conversationId);
    return { mode: 'cloud', response };
  } catch (error) {
    const appError = toAppError(error);

    if (appError.code === 'network_unavailable') {
      await sendOfflineSupportExchange(user.uid, message, conversationId);
      return { mode: 'offline_companion' };
    }

    throw createAppError(appError.code, appError.message, appError.isRetryable);
  }
}

/**
 * Sends a support chat message through the Gemini Cloud Function proxy.
 *
 * @param message - User message text.
 * @param conversationId - Conversation identifier.
 * @returns Callable function response with assistant content.
 */
export async function sendSupportChatMessage(
  message: string,
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<ChatCompletionResponse> {
  const functions = getFirebaseFunctions();
  const chatCompletion = httpsCallable<
    { message: string; conversationId: string },
    ChatCompletionResponse
  >(functions, 'chatCompletion');

  const result = await chatCompletion({ message, conversationId });
  return result.data;
}

/**
 * Reports an assistant chat message for researcher review.
 *
 * @param messageId - Assistant message document id.
 * @param reason - Selected report reason id or summary text.
 */
export async function reportSupportChatMessage(messageId: string, reason: string): Promise<void> {
  const functions = getFirebaseFunctions();
  const reportChatMessage = httpsCallable<{ messageId: string; reason: string }, { success: boolean }>(
    functions,
    'reportChatMessage',
  );

  await reportChatMessage({ messageId, reason });
}
