import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  OnboardingStepGoals,
  OnboardingStepHabits,
  OnboardingStepWelcome,
  type OnboardingGoalOption,
} from '@/components/onboarding/onboarding-steps';
import { ProgressDots } from '@/components/onboarding/progress-dots';
import { ScreenContainer } from '@/components/ui/screen-container';
import { calculateStartingDailyTarget } from '@/lib/reduction-pace';
import { completeOnboarding } from '@/lib/complete-onboarding';
import type { QuitPath } from '@/types';
import type { ReductionPace } from '@/lib/reduction-pace';

const TOTAL_STEPS = 3;
const DEFAULT_BASELINE_PUFFS = 150;

function mapGoalToQuitPath(goal: OnboardingGoalOption): QuitPath {
  return goal === 'abrupt' ? 'abrupt' : 'gradual';
}

function mapGoalToReductionPace(goal: OnboardingGoalOption): ReductionPace | null {
  if (goal === 'gentle' || goal === 'steady') {
    return goal;
  }

  return null;
}

/**
 * Adaptive onboarding flow covering welcome, habit baseline, and quit path selection.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [dailyBaselinePuffs, setDailyBaselinePuffs] = useState(DEFAULT_BASELINE_PUFFS);
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoalOption>('gentle');
  const [isSaving, setIsSaving] = useState(false);

  const startingDailyTarget = useMemo(
    () =>
      calculateStartingDailyTarget({
        quitPath: mapGoalToQuitPath(selectedGoal),
        reductionPace: mapGoalToReductionPace(selectedGoal),
        dailyBaselinePuffs,
      }),
    [dailyBaselinePuffs, selectedGoal],
  );

  const finishOnboarding = async () => {
    setIsSaving(true);

    try {
      const completedAt = new Date().toISOString();
      const quitPath = mapGoalToQuitPath(selectedGoal);

      await completeOnboarding({
        quitPath,
        reductionPace: mapGoalToReductionPace(selectedGoal),
        dailyBaselinePuffs,
        startingDailyTarget,
        targetQuitDate: quitPath === 'abrupt' ? completedAt : null,
        onboardingCompleted: true,
        completedAt,
      });

      router.replace('/');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
      <View className="min-h-full flex-1">
        <ProgressDots currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {currentStep === 1 ? (
          <OnboardingStepWelcome onContinue={() => setCurrentStep(2)} />
        ) : null}

        {currentStep === 2 ? (
          <OnboardingStepHabits
            dailyBaselinePuffs={dailyBaselinePuffs}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
            onChangeDailyBaselinePuffs={setDailyBaselinePuffs}
          />
        ) : null}

        {currentStep === 3 ? (
          <OnboardingStepGoals
            dailyBaselinePuffs={dailyBaselinePuffs}
            selectedGoal={selectedGoal}
            startingDailyTarget={startingDailyTarget}
            isSaving={isSaving}
            onBack={() => setCurrentStep(2)}
            onFinish={() => {
              void finishOnboarding();
            }}
            onSelectGoal={setSelectedGoal}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}
