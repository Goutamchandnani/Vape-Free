import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { JOURNAL_MOOD_TAGS, type JournalMoodTagId } from '@/constants/journal-moods';

export interface JournalComposerProps {
  isSaving: boolean;
  onSave: (body: string, moodTag: string | null) => void;
}

/**
 * Mood picker and text area for creating a new journal entry.
 *
 * @param props - Saving state and submit handler.
 * @returns Journal composer controls.
 */
export function JournalComposer({ isSaving, onSave }: JournalComposerProps) {
  const [draft, setDraft] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalMoodTagId | null>(null);

  const handleSave = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    onSave(trimmed, selectedMood);
    setDraft('');
    setSelectedMood(null);
  };

  return (
    <View className="gap-gutter">
      <AppText variant="headlineMd" color="onSurface">
        New reflection
      </AppText>

      <View className="flex-row flex-wrap gap-2">
        {JOURNAL_MOOD_TAGS.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <Pressable
              key={mood.id}
              accessibilityRole="button"
              accessibilityLabel={`Mood ${mood.label}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedMood(isSelected ? null : mood.id)}
            >
              <View
                className={[
                  'rounded-full px-4 py-2',
                  isSelected ? 'bg-primary-container' : 'bg-surface-container-high',
                ].join(' ')}
              >
                <AppText variant="labelSm" color={isSelected ? 'onPrimaryContainer' : 'onSurfaceVariant'}>
                  {mood.label}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="What helped today? What felt hard?"
        multiline
        editable={!isSaving}
        accessibilityLabel="Journal entry text"
        className="min-h-32 rounded-md border border-outline-variant bg-surface-container-lowest px-stack-sm py-base text-base text-on-surface"
        textAlignVertical="top"
      />

      <Button
        label="Save entry"
        accessibilityLabel="Save journal entry"
        onPress={handleSave}
        isLoading={isSaving}
        disabled={draft.trim().length === 0}
      />
    </View>
  );
}
