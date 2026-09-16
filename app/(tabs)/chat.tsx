import { useCallback, useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ChatComposer } from '@/components/chat/chat-composer';
import { ChatMessageBubble } from '@/components/chat/chat-message-bubble';
import { OfflineSupportBanner } from '@/components/chat/offline-support-banner';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { RECOMMENDED_GEMINI_MODEL } from '@/constants/chat';
import { TAB_BAR_HEIGHT } from '@/constants/theme';
import { useKeyboardHeight } from '@/hooks/use-keyboard-height';
import { shouldAnimateTransitions, useReducedMotion } from '@/hooks/use-reduced-motion';
import { useSupportChat } from '@/hooks/use-support-chat';

/**
 * AI support chat screen backed by the Gemini Cloud Function proxy.
 */
export default function ChatScreen() {
  const {
    messages,
    isLoading,
    isSending,
    isOfflineMode,
    reportingMessageId,
    errorMessage,
    refreshMessages,
    sendMessage,
    reportMessage,
  } = useSupportChat();
  const listRef = useRef<FlatList>(null);
  const keyboardHeight = useKeyboardHeight();
  const keyboardLift = Math.max(0, keyboardHeight - TAB_BAR_HEIGHT);
  const isReducedMotionEnabled = useReducedMotion();
  const shouldAnimate = shouldAnimateTransitions(isReducedMotionEnabled);

  useFocusEffect(
    useCallback(() => {
      void refreshMessages();
    }, [refreshMessages]),
  );

  useEffect(() => {
    if (keyboardLift <= 0 || messages.length === 0) {
      return;
    }

    listRef.current?.scrollToEnd({ animated: shouldAnimate });
  }, [keyboardLift, messages.length, shouldAnimate]);

  const subtitle = isOfflineMode
    ? 'Offline pre-written support is active. Reconnect for live Gemini chat.'
    : `Empathetic support powered by Gemini (${RECOMMENDED_GEMINI_MODEL}). Not a substitute for medical care.`;

  return (
    <ScreenContainer isScrollable={false}>
      <View className="flex-1">
        <View accessible accessibilityRole="header" className="mb-stack-md gap-stack-sm">
          <AppText variant="headlineLgMobile" testID="chat-screen-title">
            Support chat
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            {subtitle}
          </AppText>
        </View>

        <OfflineSupportBanner isOfflineMode={isOfflineMode} />

        {isLoading ? (
          <AppText variant="bodyMd" color="onSurfaceVariant" accessibilityLiveRegion="polite">
            Loading conversation...
          </AppText>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            accessibilityLabel="Support conversation messages"
            accessibilityHint="Swipe through messages from you and the support assistant"
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                isReporting={reportingMessageId === item.id}
                onReport={
                  item.role === 'assistant'
                    ? (messageId, reason) => {
                        void reportMessage(messageId, reason);
                      }
                    : undefined
                }
              />
            )}
            contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (messages.length > 0) {
                listRef.current?.scrollToEnd({ animated: false });
              }
            }}
            ListEmptyComponent={
              <AppText variant="bodyMd" color="onSurfaceVariant">
                Start a conversation when a craving feels tough or you want encouragement.
              </AppText>
            }
          />
        )}

        {errorMessage ? (
          <AppText variant="bodyMd" color="error" accessibilityLiveRegion="assertive">
            {errorMessage}
          </AppText>
        ) : null}

        <View style={{ marginBottom: keyboardLift }}>
          <ChatComposer
            isSending={isSending}
            isOfflineMode={isOfflineMode}
            onSend={(message) => {
              void sendMessage(message);
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
