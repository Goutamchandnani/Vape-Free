import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import {
  ChatMessageBubble,
  showChatReportReasonPicker,
} from '@/components/chat/chat-message-bubble';
import type { ChatMessage } from '@/types';

const assistantMessage: ChatMessage = {
  id: 'assistant-1',
  userId: 'user-1',
  conversationId: 'default-support',
  role: 'assistant',
  content: 'Take a deep breath and try a short walk.',
  isReported: false,
  reportReason: null,
  safetyFlags: { hasCrisisLanguage: false, hasMedicalAdviceRequest: false },
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
  isPendingSync: false,
};

describe('ChatMessageBubble', () => {
  it('renders assistant content and a report action', () => {
    const onReport = jest.fn();

    render(<ChatMessageBubble message={assistantMessage} onReport={onReport} />);

    expect(screen.getByText(assistantMessage.content)).toBeTruthy();
    expect(screen.getByLabelText('Report this assistant response as inappropriate')).toBeTruthy();
  });

  it('shows a reported label instead of the report button', () => {
    render(
      <ChatMessageBubble
        message={{ ...assistantMessage, isReported: true, reportReason: 'off_topic' }}
        onReport={jest.fn()}
      />,
    );

    expect(screen.getByText('Reported for review')).toBeTruthy();
    expect(screen.queryByLabelText('Report this assistant response as inappropriate')).toBeNull();
  });

  it('does not show report controls for user messages', () => {
    render(
      <ChatMessageBubble
        message={{ ...assistantMessage, id: 'user-1', role: 'user', content: 'I need help.' }}
        onReport={jest.fn()}
      />,
    );

    expect(screen.queryByLabelText('Report this assistant response as inappropriate')).toBeNull();
  });

  it('does not show report controls for offline companion messages', () => {
    render(
      <ChatMessageBubble
        message={{
          ...assistantMessage,
          supportSource: 'offline_companion',
        }}
        onReport={jest.fn()}
      />,
    );

    expect(screen.getByText('Offline support')).toBeTruthy();
    expect(screen.queryByLabelText('Report this assistant response as inappropriate')).toBeNull();
  });

  it('shows offline support in the accessibility label', () => {
    render(
      <ChatMessageBubble
        message={{
          ...assistantMessage,
          supportSource: 'offline_companion',
          content: 'You are doing your best.',
        }}
        onReport={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Offline support said You are doing your best.')).toBeTruthy();
  });
});

describe('showChatReportReasonPicker', () => {
  it('forwards the selected reason id to the callback', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[0]?.onPress?.();
      return undefined;
    });
    const onReport = jest.fn();

    showChatReportReasonPicker('assistant-1', onReport);

    expect(onReport).toHaveBeenCalledWith('assistant-1', 'harmful_advice');
    alertSpy.mockRestore();
  });
});
