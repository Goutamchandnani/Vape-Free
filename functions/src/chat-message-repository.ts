import { getFirestore } from 'firebase-admin/firestore';

import type { ChatSafetyFlags } from './types';

export interface StoredChatMessage {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isReported: boolean;
  reportReason: string | null;
  safetyFlags: ChatSafetyFlags;
  createdAt: string;
  updatedAt: string;
  isPendingSync: boolean;
}

function createMessageDocument(
  userId: string,
  conversationId: string,
  role: StoredChatMessage['role'],
  content: string,
  safetyFlags: ChatSafetyFlags,
): StoredChatMessage {
  const now = new Date().toISOString();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    userId,
    conversationId,
    role,
    content,
    isReported: false,
    reportReason: null,
    safetyFlags,
    createdAt: now,
    updatedAt: now,
    isPendingSync: false,
  };
}

/**
 * Loads recent chat turns for Gemini multi-turn context.
 *
 * @param userId - Firebase Auth UID.
 * @param conversationId - Conversation identifier.
 * @param limit - Maximum number of prior messages to include.
 * @returns Chronological chat turns for model context.
 */
export async function getRecentChatTurns(
  userId: string,
  conversationId: string,
  limit = 12,
): Promise<Array<{ role: 'user' | 'model'; content: string }>> {
  const snapshot = await getFirestore()
    .collection('users')
    .doc(userId)
    .collection('chatMessages')
    .where('conversationId', '==', conversationId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  const turns: Array<{ role: 'user' | 'model'; content: string }> = [];

  for (const message of snapshot.docs.map((docSnapshot) => docSnapshot.data() as StoredChatMessage).reverse()) {
    if (message.role === 'user') {
      turns.push({ role: 'user', content: message.content });
    }

    if (message.role === 'assistant') {
      turns.push({ role: 'model', content: message.content });
    }
  }

  return turns;
}

/**
 * Marks an assistant chat message as reported for researcher review.
 *
 * @param userId - Firebase Auth UID.
 * @param messageId - Assistant message document id.
 * @param reason - User-selected report reason id or free-text summary.
 */
export async function reportAssistantMessage(
  userId: string,
  messageId: string,
  reason: string,
): Promise<void> {
  const messageRef = getFirestore()
    .collection('users')
    .doc(userId)
    .collection('chatMessages')
    .doc(messageId);

  const snapshot = await messageRef.get();

  if (!snapshot.exists) {
    throw new Error('Message not found.');
  }

  const message = snapshot.data() as StoredChatMessage;

  if (message.role !== 'assistant') {
    throw new Error('Only assistant messages can be reported.');
  }

  if (message.isReported) {
    return;
  }

  const now = new Date().toISOString();

  await messageRef.update({
    isReported: true,
    reportReason: reason,
    updatedAt: now,
  });
}

/**
 * Persists a chat message under users/{uid}/chatMessages.
 *
 * @param message - Message document to store.
 */
export async function saveChatMessage(message: StoredChatMessage): Promise<void> {
  await getFirestore()
    .collection('users')
    .doc(message.userId)
    .collection('chatMessages')
    .doc(message.id)
    .set(message);
}

/**
 * Stores a user and assistant exchange in Firestore.
 *
 * @param params - Exchange details including safety flags.
 * @returns Saved assistant message id.
 */
export async function persistChatExchange(params: {
  userId: string;
  conversationId: string;
  userMessage: string;
  assistantMessage: string;
  safetyFlags: ChatSafetyFlags;
}): Promise<string> {
  const userDocument = createMessageDocument(
    params.userId,
    params.conversationId,
    'user',
    params.userMessage,
    params.safetyFlags,
  );
  const assistantDocument = createMessageDocument(
    params.userId,
    params.conversationId,
    'assistant',
    params.assistantMessage,
    params.safetyFlags,
  );

  const batch = getFirestore().batch();
  const userRef = getFirestore()
    .collection('users')
    .doc(params.userId)
    .collection('chatMessages')
    .doc(userDocument.id);
  const assistantRef = getFirestore()
    .collection('users')
    .doc(params.userId)
    .collection('chatMessages')
    .doc(assistantDocument.id);

  batch.set(userRef, userDocument);
  batch.set(assistantRef, assistantDocument);
  batch.set(
    getFirestore().collection('users').doc(params.userId),
    { updatedAt: new Date().toISOString(), lastChatAt: new Date().toISOString() },
    { merge: true },
  );

  await batch.commit();
  return assistantDocument.id;
}
