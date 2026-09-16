import type { ChatMessage } from '@/types';

/**
 * Merges cloud and offline companion messages into one chronological thread.
 * Cloud messages win when ids collide.
 *
 * @param cloudMessages - Messages loaded from Firestore.
 * @param offlineMessages - Device-only offline companion messages.
 * @returns Combined chronological messages.
 */
export function mergeChatMessages(
  cloudMessages: ChatMessage[],
  offlineMessages: ChatMessage[],
): ChatMessage[] {
  const merged = new Map<string, ChatMessage>();

  for (const message of cloudMessages) {
    merged.set(message.id, message);
  }

  for (const message of offlineMessages) {
    merged.set(message.id, message);
  }

  return [...merged.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

/**
 * Returns true when a message came from the offline companion rather than Gemini.
 *
 * @param message - Chat message document.
 * @returns Whether the message is offline-only support.
 */
export function isOfflineCompanionMessage(message: ChatMessage): boolean {
  return message.supportSource === 'offline_companion';
}
