import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { DailyProgressCard, StatTile } from '@/components/home/dashboard-cards';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { VapeFreeLogo } from '@/components/ui/vapefree-logo';
import { useHomeDashboard } from '@/hooks/use-home-dashboard';

/**
 * Home dashboard with live streak, daily puff progress, and quick log actions.
 */
export default function HomeScreen() {
  const router = useRouter();
  const {
    profile,
    dailyProgress,
    streakDays,
    cravingCountToday,
    isLoading,
    refreshDashboard,
  } = useHomeDashboard();

  useFocusEffect(
    useCallback(() => {
      void refreshDashboard();
    }, [refreshDashboard]),
  );

  const headline = profile?.onboardingCompleted ? 'You are doing great' : 'Welcome to VapeFree';
  const subheadline = profile?.onboardingCompleted
    ? 'Every breath gets a little easier.'
    : 'One step at a time. You are building a vape-free routine.';

  return (
    <ScreenContainer>
      <View className="gap-stack-lg">
        <View accessible accessibilityRole="header" className="items-center gap-stack-sm">
          {!profile?.onboardingCompleted ? <VapeFreeLogo size={96} /> : null}
          <AppText variant="headlineLgMobile" color="onSurface" className="text-center">
            {headline}
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant" className="text-center">
            {subheadline}
          </AppText>
        </View>

        <View className="flex-row gap-gutter">
          <StatTile
            label="Days clean"
            value={isLoading ? '...' : `${streakDays}`}
            accessibilityLabel={`Current streak, ${streakDays} days`}
          />
          <StatTile
            label="Cravings logged"
            value={isLoading ? '...' : `${cravingCountToday}`}
            accessibilityLabel={`${cravingCountToday} cravings logged today`}
          />
        </View>

        <DailyProgressCard
          progress={dailyProgress}
          cravingCountToday={cravingCountToday}
          isLoading={isLoading}
        />

        <View className="gap-gutter">
          <Button
            label="Log a puff"
            accessibilityLabel="Log a puff"
            onPress={() => router.push('/track')}
          />

          {!profile?.onboardingCompleted ? (
            <Button
              label="Finish onboarding"
              variant="secondary"
              accessibilityLabel="Finish onboarding setup"
              onPress={() => router.push('/onboarding')}
            />
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}
