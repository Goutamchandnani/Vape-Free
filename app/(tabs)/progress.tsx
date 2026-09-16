import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { MilestoneGrid } from '@/components/progress/milestone-grid';
import { PuffTrendChart } from '@/components/progress/puff-trend-chart';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { useProgressData } from '@/hooks/use-progress-data';

/**
 * Progress screen with seven-day puff trend and milestone grid.
 */
export default function ProgressScreen() {
  const {
    dailySeries,
    weekOverWeekChange,
    milestones,
    isLoading,
    errorMessage,
    refreshProgress,
  } = useProgressData();

  useFocusEffect(
    useCallback(() => {
      void refreshProgress();
    }, [refreshProgress]),
  );

  return (
    <ScreenContainer>
      <View className="gap-stack-lg">
        <View accessible accessibilityRole="header" className="gap-stack-sm">
          <AppText variant="headlineLgMobile">Your Progress</AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            See how far you&apos;ve come.
          </AppText>
        </View>

        <PuffTrendChart
          series={dailySeries}
          weekOverWeekChange={weekOverWeekChange}
          isLoading={isLoading}
        />

        <MilestoneGrid milestones={milestones} isLoading={isLoading} />

        {errorMessage ? (
          <AppText variant="bodyMd" color="error">
            {errorMessage}
          </AppText>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
