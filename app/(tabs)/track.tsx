import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter, type Href } from 'expo-router';

import {
  IntensitySelector,
  PuffLogButton,
  TriggerChip,
} from '@/components/track/tracking-controls';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScreenContainer } from '@/components/ui/screen-container';
import { CRAVING_TRIGGER_TAGS } from '@/constants/tracking-triggers';
import { useTodayTracking } from '@/hooks/use-today-tracking';
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from '@/lib/analytics-service';
import { saveCravingLog, saveVapingSession } from '@/lib/tracking-repository';
import type { CravingIntensity } from '@/types';

const REFRAME_ROUTE = '/reframe' as Href;

/**
 * Track screen for logging puffs and cravings, synced to Firestore offline-first.
 */
export default function TrackScreen() {
  const router = useRouter();
  const { summary, isLoading, isSaving, errorMessage, refreshSummary, runTrackingAction } =
    useTodayTracking();
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<CravingIntensity>(3);
  const [resisted, setResisted] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refreshSummary();
    }, [refreshSummary]),
  );

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((current) =>
      current.includes(trigger) ? current.filter((tag) => tag !== trigger) : [...current, trigger],
    );
  };

  const logPuff = () => {
    void runTrackingAction(async () => {
      await saveVapingSession({ puffCount: 1 });
      trackAnalyticsEvent(ANALYTICS_EVENTS.puffLogged, { puff_count: 1 });
      setSaveMessage('Puff logged.');
      router.push(REFRAME_ROUTE);
    });
  };

  const saveCraving = () => {
    const didResist = resisted;

    void runTrackingAction(async () => {
      await saveCravingLog({
        intensity,
        triggerTags: selectedTriggers,
        resisted: didResist,
      });
      trackAnalyticsEvent(ANALYTICS_EVENTS.cravingLogged, {
        intensity,
        resisted: didResist,
        trigger_count: selectedTriggers.length,
      });
      setSelectedTriggers([]);
      setIntensity(3);
      setResisted(true);
      setSaveMessage('Craving log saved.');

      if (!didResist) {
        router.push(REFRAME_ROUTE);
      }
    });
  };

  return (
    <ScreenContainer>
      <View className="gap-stack-lg">
        <View accessible accessibilityRole="header" className="gap-stack-sm">
          <AppText variant="headlineLgMobile" testID="track-screen-title">
            Track
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Log puffs and cravings to understand your patterns. It is okay to feel this way.
          </AppText>
        </View>

        <Card accessible accessibilityLabel={`Today you have logged ${summary.puffCountToday} puffs and ${summary.cravingCountToday} cravings`}>
          <AppText variant="labelMd" color="onSurfaceVariant">
            Today
          </AppText>
          <AppText variant="headlineXl" color="primary">
            {isLoading ? '...' : `${summary.puffCountToday} puffs`}
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            {isLoading
              ? 'Loading cravings...'
              : `${summary.cravingCountToday} craving logs today`}
          </AppText>
        </Card>

        <View className="items-center gap-stack-sm">
          <AppText variant="headlineMd" color="onSurface">
            Log a puff
          </AppText>
          <PuffLogButton isSaving={isSaving} onPress={logPuff} />
        </View>

        <Card className="gap-stack-md">
          <View className="gap-stack-sm">
            <AppText variant="headlineMd" color="onSurface">
              How are you feeling?
            </AppText>
            <AppText variant="bodyMd" color="onSurfaceVariant">
              Select triggers and intensity, then save a craving log.
            </AppText>
          </View>

          <View className="flex-row flex-wrap gap-gutter">
            {CRAVING_TRIGGER_TAGS.map((trigger) => (
              <TriggerChip
                key={trigger}
                label={trigger}
                isSelected={selectedTriggers.includes(trigger)}
                onPress={() => toggleTrigger(trigger)}
              />
            ))}
          </View>

          <View className="gap-stack-sm">
            <AppText variant="labelMd" color="onSurfaceVariant">
              Craving intensity
            </AppText>
            <IntensitySelector value={intensity} onChange={(value) => setIntensity(value as CravingIntensity)} />
          </View>

          <Button
            label={resisted ? 'I resisted this craving' : 'I did not resist'}
            variant={resisted ? 'secondary' : 'ghost'}
            accessibilityLabel={
              resisted
                ? 'Mark that you resisted this craving'
                : 'Mark that you did not resist this craving'
            }
            onPress={() => setResisted((current) => !current)}
          />

          <Button
            label="Save craving log"
            accessibilityLabel="Save craving log"
            onPress={saveCraving}
            isLoading={isSaving}
          />
        </Card>

        {errorMessage ? (
          <AppText variant="bodyMd" color="error" accessibilityLiveRegion="polite">
            {errorMessage}
          </AppText>
        ) : null}

        {saveMessage && !errorMessage ? (
          <AppText variant="bodyMd" color="tertiary" accessibilityLiveRegion="polite">
            {saveMessage}
          </AppText>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
