import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SUPPORT_CONVERSATION_ID } from '@/constants/chat';
import { matchOfflineSupportMessage } from '@/lib/offline-support-matcher';
import type { ChatMessage, ChatSupportSource } from '@/types';

export const OFFLINE_CHAT_STORAGE_PREFIX = '@vapefree/offline-chat-messages';

function getOfflineChatStorageKey(userId: string, conversationId: string): string {
  return `${OFFLINE_CHAT_STORAGE_PREFIX}/${userId}/${conversationId}`;
}

function createOfflineMessageId(): string {
  return `offline-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildChatMessage(params: {
  userId: string;
  conversationId: string;
  role: ChatMessage['role'];
  content: string;
  supportSource: ChatSupportSource;
  safetyFlags: ChatMessage['safetyFlags'];
}): ChatMessage {
  const now = new Date().toISOString();

  return {
    id: createOfflineMessageId(),
    userId: params.userId,
    conversationId: params.conversationId,
    role: params.role,
    content: params.content,
    isReported: false,
    reportReason: null,
    safetyFlags: params.safetyFlags,
    supportSource: params.supportSource,
    createdAt: now,
    updatedAt: now,
    isPendingSync: true,
  };
}

/**
 * Loads locally stored offline companion messages for a conversation.
 *
 * @param userId - Firebase Auth UID.
 * @param conversationId - Conversation identifier.
 * @returns Chronological offline messages.
 */
export async function getOfflineChatMessages(
  userId: string,
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<ChatMessage[]> {
  const rawValue = await AsyncStorage.getItem(getOfflineChatStorageKey(userId, conversationId));

  if (!rawValue) {
    return [];
  }

  const parsed = JSON.parse(rawValue) as ChatMessage[];
  return parsed.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

/**
 * Persists offline companion messages for offline-first chat history.
 *
 * @param userId - Firebase Auth UID.
 * @param conversationId - Conversation identifier.
 * @param messages - Messages to store.
 */
export async function saveOfflineChatMessages(
  userId: string,
  conversationId: string,
  messages: ChatMessage[],
): Promise<void> {
  await AsyncStorage.setItem(getOfflineChatStorageKey(userId, conversationId), JSON.stringify(messages));
}

/**
 * Creates a user and offline companion exchange stored on device only.
 *
 * @param userId - Firebase Auth UID.
 * @param message - User message text.
 * @param conversationId - Conversation identifier.
 * @returns Saved user and assistant messages.
 */
export async function sendOfflineSupportExchange(
  userId: string,
  message: string,
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const existingMessages = await getOfflineChatMessages(userId, conversationId);
  const match = matchOfflineSupportMessage(message);

  const userMessage = buildChatMessage({
    userId,
    conversationId,
    role: 'user',
    content: message,
    supportSource: 'offline_companion',
    safetyFlags: match.safetyFlags,
  });

  const assistantMessage = buildChatMessage({
    userId,
    conversationId,
    role: 'assistant',
    content: match.response,
    supportSource: 'offline_companion',
    safetyFlags: match.safetyFlags,
  });

  await saveOfflineChatMessages(userId, conversationId, [
    ...existingMessages,
    userMessage,
    assistantMessage,
  ]);

  return { userMessage, assistantMessage };
}

/**
 * Clears stored offline companion messages. Useful in tests.
 *
 * @param userId - Firebase Auth UID.
 * @param conversationId - Conversation identifier.
 */
export async function clearOfflineChatMessages(
  userId: string,
  conversationId = DEFAULT_SUPPORT_CONVERSATION_ID,
): Promise<void> {
  await AsyncStorage.removeItem(getOfflineChatStorageKey(userId, conversationId));
}
