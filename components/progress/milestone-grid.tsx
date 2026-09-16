import { useState } from 'react';
import { View } from 'react-native';

import { MilestoneCard } from '@/components/progress/milestone-card';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import type { MilestoneStatus } from '@/lib/milestones';

export interface MilestoneGridProps {
  milestones: MilestoneStatus[];
  isLoading: boolean;
}

/**
 * Grid of milestone cards with toggle for upcoming locked milestones.
 *
 * @param props - Milestone statuses and loading state.
 * @returns Milestone section for the progress screen.
 */
export function MilestoneGrid({ milestones, isLoading }: MilestoneGridProps) {
  const [showUpcoming, setShowUpcoming] = useState(false);

  const unlocked = milestones.filter((milestone) => milestone.isUnlocked);
  const upcoming = milestones.filter((milestone) => !milestone.isUnlocked);
  const visibleMilestones = showUpcoming ? milestones : unlocked;

  return (
    <View className="gap-gutter">
        <AppText variant="headlineMd" color="onSurface">
          {showUpcoming ? 'All Milestones' : `Unlocked Milestones (${unlocked.length})`}
        </AppText>

      {isLoading ? (
        <AppText variant="bodyMd" color="onSurfaceVariant">
          Loading milestones...
        </AppText>
      ) : visibleMilestones.length === 0 ? (
        <AppText variant="bodyMd" color="onSurfaceVariant">
          Keep logging puffs and cravings to unlock your first milestone.
        </AppText>
      ) : (
        <View className="flex-row flex-wrap gap-gutter">
          {visibleMilestones.map((milestone) => (
            <View key={milestone.id} className="w-[47%]">
              <MilestoneCard milestone={milestone} />
            </View>
          ))}
        </View>
      )}

      {upcoming.length > 0 ? (
        <Button
          label={showUpcoming ? 'Show unlocked only' : 'View upcoming milestones'}
          variant="secondary"
          accessibilityLabel={
            showUpcoming ? 'Show unlocked milestones only' : 'View upcoming milestones'
          }
          onPress={() => setShowUpcoming((current) => !current)}
        />
      ) : null}
    </View>
  );
}
