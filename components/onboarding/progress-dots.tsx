import { View } from 'react-native';

import { colors } from '@/constants/theme';

export interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * Step progress indicator used across the onboarding flow.
 *
 * @param props - Active step index and total step count.
 * @returns Row of accessible progress dots.
 */
export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Onboarding step ${currentStep} of ${totalSteps}`}
      accessibilityValue={{ min: 1, max: totalSteps, now: currentStep }}
      className="mb-stack-lg flex-row items-center justify-center gap-2"
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <View
            key={stepNumber}
            importantForAccessibility="no"
            accessible={false}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: isActive ? colors.primary : colors.surfaceVariant,
            }}
          />
        );
      })}
    </View>
  );
}
