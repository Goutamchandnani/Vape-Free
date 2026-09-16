import { FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { JournalComposer } from '@/components/journal/journal-composer';
import { JournalEntryCard } from '@/components/journal/journal-entry-card';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TAB_BAR_HEIGHT } from '@/constants/theme';
import { useKeyboardHeight } from '@/hooks/use-keyboard-height';
import { useJournal } from '@/hooks/use-journal';

/**
 * Reflective journal screen with offline-first Firestore persistence.
 */
export default function JournalScreen() {
  const { entries, isLoading, isSaving, errorMessage, refreshEntries, createEntry, updateEntry, deleteEntry } =
    useJournal();
  const keyboardHeight = useKeyboardHeight();
  const keyboardLift = Math.max(0, keyboardHeight - TAB_BAR_HEIGHT);

  useFocusEffect(
    useCallback(() => {
      void refreshEntries();
    }, [refreshEntries]),
  );

  return (
    <ScreenContainer isScrollable={false}>
      <View className="flex-1" style={{ marginBottom: keyboardLift }}>
        <View accessible accessibilityRole="header" className="mb-stack-md gap-stack-sm">
          <AppText variant="headlineLgMobile">Journal</AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Capture reflections as you move through your quit journey.
          </AppText>
        </View>

        <JournalComposer isSaving={isSaving} onSave={(body, moodTag) => void createEntry(body, moodTag)} />

        <View className="my-stack-md h-px bg-outline-variant" />

        <AppText variant="headlineMd" color="onSurface" className="mb-gutter">
          Recent entries
        </AppText>

        {isLoading ? (
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Loading entries...
          </AppText>
        ) : entries.length === 0 ? (
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Your reflections will appear here after you save your first entry.
          </AppText>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JournalEntryCard
                entry={item}
                isSaving={isSaving}
                onUpdate={(entryId, body, moodTag) => void updateEntry(entryId, body, moodTag)}
                onDelete={(entryId) => void deleteEntry(entryId)}
              />
            )}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            style={{ flex: 1 }}
          />
        )}

        {errorMessage ? (
          <AppText variant="bodyMd" color="error" className="mt-gutter">
            {errorMessage}
          </AppText>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
