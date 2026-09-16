import { Alert, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { CHAT_REPORT_REASONS } from '@/constants/chat-report';
import { colors } from '@/constants/theme';
import { isOfflineCompanionMessage } from '@/lib/merge-chat-messages';
import type { ChatMessage } from '@/types';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  isReporting?: boolean;
  onReport?: (messageId: string, reason: string) => void;
}

/**
 * Opens a native alert with predefined report reasons for assistant messages.
 *
 * @param messageId - Assistant message id to report.
 * @param onReport - Callback invoked with the selected reason id.
 */
export function showChatReportReasonPicker(
  messageId: string,
  onReport: (messageId: string, reason: string) => void,
): void {
  Alert.alert(
    'Report response',
    'Why is this response inappropriate? Your report is sent to the research team for review.',
    [
      ...CHAT_REPORT_REASONS.map((reason) => ({
        text: reason.label,
        onPress: () => onReport(messageId, reason.id),
      })),
      { text: 'Cancel', style: 'cancel' },
    ],
  );
}

/**
 * Renders a single chat message bubble for user or assistant roles.
 *
 * @param props - Chat message document and optional report handler.
 * @returns Styled message bubble.
 */
export function ChatMessageBubble({
  message,
  isReporting = false,
  onReport,
}: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isOfflineCompanion = isOfflineCompanionMessage(message);
  const speakerLabel = isUser ? 'You' : isOfflineCompanion ? 'Offline support' : 'Support assistant';
  const canReport = !isUser && !isOfflineCompanion && !message.isReported && onReport;

  return (
    <View className={isUser ? 'items-end' : 'items-start'}>
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${speakerLabel} said ${message.content}`}
        testID={isUser ? `chat-message-user-${message.id}` : `chat-message-assistant-${message.id}`}
        className={['max-w-[85%] rounded-md p-stack-sm', isUser ? 'bg-primary-container' : 'bg-surface-container-lowest'].join(
          ' ',
        )}
        style={!isUser ? { borderColor: colors.outlineVariant, borderWidth: 1 } : undefined}
      >
        <AppText variant="labelSm" color={isUser ? 'onPrimaryContainer' : 'onSurfaceVariant'} limitFontScaling>
          {isUser ? 'You' : isOfflineCompanion ? 'Offline support' : 'Support'}
        </AppText>
        <AppText
          variant="bodyMd"
          color={isUser ? 'onPrimaryContainer' : 'onSurface'}
          className="mt-1"
        >
          {message.content}
        </AppText>
      </View>

      {canReport ? (
        <Button
          label={isReporting ? 'Reporting...' : 'Report response'}
          variant="ghost"
          isLoading={isReporting}
          accessibilityLabel="Report this assistant response as inappropriate"
          testID={`chat-report-${message.id}`}
          className="mt-1 self-start"
          onPress={() => showChatReportReasonPicker(message.id, onReport)}
        />
      ) : null}

      {!isUser && message.isReported ? (
        <AppText variant="labelSm" color="onSurfaceVariant" className="mt-1">
          Reported for review
        </AppText>
      ) : null}
    </View>
  );
}
