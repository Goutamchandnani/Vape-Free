import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';

export interface ChatComposerProps {
  isSending: boolean;
  isOfflineMode?: boolean;
  onSend: (message: string) => void;
}

/**
 * Text input and send action for the support chat screen.
 *
 * @param props - Sending state and submit handler.
 * @returns Message composer controls.
 */
export function ChatComposer({ isSending, isOfflineMode = false, onSend }: ChatComposerProps) {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setDraft('');
  };

  return (
    <View className="gap-gutter border-t border-outline-variant pt-stack-sm">
      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder={
          isOfflineMode
            ? 'Share how you are feeling. Offline replies are pre-written.'
            : 'Share how you are feeling...'
        }
        multiline
        editable={!isSending}
        accessibilityLabel="Support chat message"
        accessibilityHint={
          isOfflineMode
            ? 'Sends your message to offline pre-written support while you are disconnected'
            : 'Sends your message to the support assistant'
        }
        allowFontScaling
        maxFontSizeMultiplier={2}
        className="min-h-24 rounded-md border border-outline-variant bg-surface-container-lowest px-stack-sm py-base text-base text-on-surface"
        textAlignVertical="top"
      />
      <Button
        label="Send message"
        accessibilityLabel="Send support chat message"
        onPress={handleSend}
        isLoading={isSending}
        disabled={draft.trim().length === 0}
      />
    </View>
  );
}
