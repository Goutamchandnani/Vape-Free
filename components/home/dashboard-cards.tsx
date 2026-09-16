import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import type { DailyPlanProgress } from '@/lib/daily-plan-progress';

export interface DailyProgressCardProps {
  progress: DailyPlanProgress;
  cravingCountToday: number;
  isLoading: boolean;
}

/**
 * Home dashboard card showing today's puff progress against the plan cap.
 *
 * @param props - Daily progress metrics and loading state.
 * @returns Progress summary card aligned to the home wireframe.
 */
export function DailyProgressCard({ progress, cravingCountToday, isLoading }: DailyProgressCardProps) {
  const limitLabel =
    progress.dailyCap > 0 ? `${progress.loggedPuffsToday}/${progress.dailyCap}` : `${progress.loggedPuffsToday}`;

  return (
    <Card
      accessible
      accessibilityLabel={`Today's puffs ${limitLabel}. ${progress.statusMessage}`}
      className="gap-stack-md"
    >
      <AppText variant="headlineMd" color="onSurface">
        Today&apos;s puffs
      </AppText>

      <View className="items-center gap-stack-sm">
        <AppText variant="headlineXl" color="primary">
          {isLoading ? '...' : limitLabel}
        </AppText>
        {progress.dailyCap > 0 ? (
          <AppText variant="labelMd" color="onSurfaceVariant">
            Daily limit
          </AppText>
        ) : null}
      </View>

      <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress.progressPercent}%` as `${number}%` }}
        />
      </View>

      <AppText variant="bodyMd" color="onSurfaceVariant">
        {isLoading ? 'Loading your progress...' : progress.statusMessage}
      </AppText>

      <AppText variant="labelMd" color="onSurfaceVariant">
        {isLoading ? '...' : `${cravingCountToday} craving logs today`}
      </AppText>
    </Card>
  );
}

export interface StatTileProps {
  label: string;
  value: string;
  accessibilityLabel: string;
}

/**
 * Compact stat tile used in the home dashboard bento grid.
 *
 * @param props - Label, value, and accessibility text.
 * @returns Small stat card.
 */
export function StatTile({ label, value, accessibilityLabel }: StatTileProps) {
  return (
    <Card accessible accessibilityLabel={accessibilityLabel} className="flex-1 items-center">
      <AppText variant="headlineXl" color="primary">
        {value}
      </AppText>
      <AppText variant="labelSm" color="onSurfaceVariant" className="mt-1 uppercase">
        {label}
      </AppText>
    </Card>
  );
}
