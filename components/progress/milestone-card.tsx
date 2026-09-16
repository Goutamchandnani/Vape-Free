import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { colors } from '@/constants/theme';
import { formatMilestoneProgressLabel } from '@/lib/milestone-progress';
import type { MilestoneStatus } from '@/lib/milestones';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface MilestoneCardProps {
  milestone: MilestoneStatus;
}

const ACCENT_STYLES = [
  'bg-tertiary-container',
  'bg-primary-container',
  'bg-secondary-container',
] as const;

/**
 * Single milestone tile for the progress bento grid.
 *
 * @param props - Milestone status with unlock state.
 * @returns Milestone card with icon, title, and subtitle.
 */
export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const accentIndex = milestone.id.length % ACCENT_STYLES.length;
  const iconName = milestone.icon as IoniconName;
  const isLocked = !milestone.isUnlocked;
  const progressLabel = isLocked
    ? formatMilestoneProgressLabel(milestone.kind, milestone.progressValue, milestone.threshold)
    : null;

  return (
    <Card
      accessible
      accessibilityLabel={`${milestone.title}. ${milestone.subtitle}. ${isLocked ? `Locked. Progress ${progressLabel}` : 'Unlocked'}`}
      className={`items-center gap-stack-sm ${isLocked ? 'opacity-70' : ''}`}
    >
      <View
        className={[
          'h-14 w-14 items-center justify-center rounded-full',
          ACCENT_STYLES[accentIndex],
        ].join(' ')}
      >
        <Ionicons
          name={isLocked ? 'lock-closed-outline' : iconName}
          size={28}
          color={colors.onPrimaryContainer}
        />
      </View>

      <View className="items-center">
        <AppText variant="labelMd" color="onSurface" className="text-center">
          {milestone.title}
        </AppText>
        <AppText variant="labelSm" color="onSurfaceVariant" className="mt-1 text-center">
          {milestone.subtitle}
        </AppText>
        {progressLabel ? (
          <AppText variant="labelSm" color="primary" className="mt-1 text-center">
            {progressLabel}
          </AppText>
        ) : null}
      </View>
    </Card>
  );
}
