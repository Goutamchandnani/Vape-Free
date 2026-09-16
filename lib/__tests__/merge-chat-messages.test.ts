import { mergeChatMessages, isOfflineCompanionMessage } from '@/lib/merge-chat-messages';
import type { ChatMessage } from '@/types';

const baseMessage: ChatMessage = {
  id: 'message-1',
  userId: 'user-1',
  conversationId: 'default-support',
  role: 'assistant',
  content: 'Hello',
  isReported: false,
  reportReason: null,
  safetyFlags: { hasCrisisLanguage: false, hasMedicalAdviceRequest: false },
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
  isPendingSync: false,
};

describe('merge-chat-messages', () => {
  it('merges cloud and offline messages chronologically', () => {
    const merged = mergeChatMessages(
      [{ ...baseMessage, id: 'cloud-1', createdAt: '2026-09-07T11:00:00.000Z', supportSource: 'cloud' }],
      [
        {
          ...baseMessage,
          id: 'offline-1',
          createdAt: '2026-09-07T10:30:00.000Z',
          supportSource: 'offline_companion',
        },
      ],
    );

    expect(merged.map((message) => message.id)).toEqual(['offline-1', 'cloud-1']);
  });

  it('identifies offline companion messages', () => {
    expect(isOfflineCompanionMessage({ ...baseMessage, supportSource: 'offline_companion' })).toBe(
      true,
    );
    expect(isOfflineCompanionMessage({ ...baseMessage, supportSource: 'cloud' })).toBe(false);
  });
});
