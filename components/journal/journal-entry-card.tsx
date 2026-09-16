import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JOURNAL_MOOD_TAGS, type JournalMoodTagId } from '@/constants/journal-moods';
import type { JournalEntry } from '@/types';

export interface JournalEntryCardProps {
  entry: JournalEntry;
  isSaving: boolean;
  onUpdate: (entryId: string, body: string, moodTag: string | null) => void;
  onDelete: (entryId: string) => void;
}

function formatEntryDate(loggedAt: string): string {
  const date = new Date(loggedAt);

  if (Number.isNaN(date.getTime())) {
    return loggedAt;
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getMoodLabel(moodTag: string | null): string | null {
  if (!moodTag) {
    return null;
  }

  return JOURNAL_MOOD_TAGS.find((tag) => tag.id === moodTag)?.label ?? moodTag;
}

/**
 * Displays a journal entry with inline edit and delete actions.
 *
 * @param props - Entry document and mutation handlers.
 * @returns Journal entry card.
 */
export function JournalEntryCard({ entry, isSaving, onUpdate, onDelete }: JournalEntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(entry.body);
  const [selectedMood, setSelectedMood] = useState<JournalMoodTagId | null>(
    (entry.moodTag as JournalMoodTagId | null) ?? null,
  );

  const moodLabel = getMoodLabel(entry.moodTag);

  const handleSave = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    onUpdate(entry.id, trimmed, selectedMood);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(entry.body);
    setSelectedMood((entry.moodTag as JournalMoodTagId | null) ?? null);
    setIsEditing(false);
  };

  return (
    <Card accessible accessibilityLabel={`Journal entry from ${formatEntryDate(entry.loggedAt)}`}>
      <View className="gap-stack-sm">
        <View className="flex-row items-center justify-between gap-gutter">
          <AppText variant="labelMd" color="onSurfaceVariant">
            {formatEntryDate(entry.loggedAt)}
          </AppText>
          {!isEditing && moodLabel ? (
            <View className="rounded-full bg-surface-container-high px-3 py-1">
              <AppText variant="labelSm" color="primary">
                {moodLabel}
              </AppText>
            </View>
          ) : null}
        </View>

        {isEditing ? (
          <>
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
                        'rounded-full px-3 py-1',
                        isSelected ? 'bg-primary-container' : 'bg-surface-container-high',
                      ].join(' ')}
                    >
                      <AppText
                        variant="labelSm"
                        color={isSelected ? 'onPrimaryContainer' : 'onSurfaceVariant'}
                      >
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
              multiline
              editable={!isSaving}
              accessibilityLabel="Edit journal entry text"
              className="min-h-24 rounded-md border border-outline-variant bg-surface-container-lowest px-stack-sm py-base text-base text-on-surface"
              textAlignVertical="top"
            />

            <View className="gap-gutter">
              <Button
                label="Save changes"
                accessibilityLabel="Save journal entry changes"
                onPress={handleSave}
                isLoading={isSaving}
                disabled={draft.trim().length === 0}
              />
              <Button
                label="Cancel"
                variant="ghost"
                accessibilityLabel="Cancel editing journal entry"
                onPress={handleCancel}
                disabled={isSaving}
              />
            </View>
          </>
        ) : (
          <>
            <AppText variant="bodyMd" color="onSurface">
              {entry.body}
            </AppText>

            <View className="flex-row gap-gutter">
              <Button
                label="Edit"
                variant="secondary"
                accessibilityLabel="Edit journal entry"
                onPress={() => setIsEditing(true)}
                disabled={isSaving}
              />
              <Button
                label="Delete"
                variant="ghost"
                accessibilityLabel="Delete journal entry"
                onPress={() => onDelete(entry.id)}
                isLoading={isSaving}
              />
            </View>
          </>
        )}
      </View>
    </Card>
  );
}
