import { useCallback, useEffect, useState } from 'react';

import { ANALYTICS_EVENTS, trackAnalyticsEvent } from '@/lib/analytics-service';
import { DEFAULT_SUPPORT_CONVERSATION_ID } from '@/constants/chat';
import {
  getAllSupportChatMessages,
  reportSupportChatMessage,
  sendSupportMessage,
} from '@/lib/chat-service';
import { isOfflineCompanionMessage } from '@/lib/merge-chat-messages';
import { useNetworkStatus } from '@/hooks/use-network-status';
import type { ChatMessage } from '@/types';

interface UseSupportChatResult {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  isOfflineMode: boolean;
  reportingMessageId: string | null;
  errorMessage: string | null;
  refreshMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  reportMessage: (messageId: string, reason: string) => Promise<void>;
}

/**
 * Loads and sends messages for the AI support chat screen.
 *
 * @returns Chat history, send helper, offline mode flag, and loading states.
 */
export function useSupportChat(): UseSupportChatResult {
  const isOnline = useNetworkStatus();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usedOfflineCompanion, setUsedOfflineCompanion] = useState(false);

  const isOfflineMode = !isOnline || usedOfflineCompanion;

  const refreshMessages = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextMessages = await getAllSupportChatMessages(DEFAULT_SUPPORT_CONVERSATION_ID);
      setMessages(nextMessages);
      setUsedOfflineCompanion(nextMessages.some(isOfflineCompanionMessage));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not load chat history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!trimmed) {
        return;
      }

      setIsSending(true);
      setErrorMessage(null);

      try {
        const result = await sendSupportMessage(trimmed, DEFAULT_SUPPORT_CONVERSATION_ID);

        if (result.mode === 'offline_companion') {
          trackAnalyticsEvent(ANALYTICS_EVENTS.offlineChatMessageSent);
          setUsedOfflineCompanion(true);
        } else {
          trackAnalyticsEvent(ANALYTICS_EVENTS.chatMessageSent);
        }

        await refreshMessages();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not send your message.');
      } finally {
        setIsSending(false);
      }
    },
    [refreshMessages],
  );

  const reportMessage = useCallback(
    async (messageId: string, reason: string) => {
      setReportingMessageId(messageId);
      setErrorMessage(null);

      try {
        await reportSupportChatMessage(messageId, reason);
        trackAnalyticsEvent(ANALYTICS_EVENTS.chatMessageReported, { reason });
        await refreshMessages();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not report this message.');
      } finally {
        setReportingMessageId(null);
      }
    },
    [refreshMessages],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      setIsLoading(true);

      try {
        const nextMessages = await getAllSupportChatMessages(DEFAULT_SUPPORT_CONVERSATION_ID);

        if (isMounted) {
          setMessages(nextMessages);
          setUsedOfflineCompanion(nextMessages.some(isOfflineCompanionMessage));
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load chat history.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    isOfflineMode,
    reportingMessageId,
    errorMessage,
    refreshMessages,
    sendMessage,
    reportMessage,
  };
}
