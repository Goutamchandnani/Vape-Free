import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VapeFreeLogo } from '@/components/ui/vapefree-logo';
import { colors, shadows } from '@/constants/theme';

export interface OnboardingStepWelcomeProps {
  onContinue: () => void;
}

/**
 * First onboarding step introducing the VapeFree companion experience.
 *
 * @param props - Continue handler for the welcome step.
 * @returns Welcome screen content aligned to the Stitch wireframe.
 */
export function OnboardingStepWelcome({ onContinue }: OnboardingStepWelcomeProps) {
  return (
    <View className="gap-stack-lg pb-stack-md">
      <View className="items-center gap-stack-md">
        <VapeFreeLogo size={160} />

        <View accessible accessibilityRole="header" className="items-center gap-stack-sm">
          <AppText variant="headlineXl" color="onSurface" className="text-center">
            Welcome to VapeFree
          </AppText>
          <AppText variant="bodyLg" color="onSurfaceVariant" className="max-w-sm text-center">
            Your calm companion on the journey to breathing easier. No pressure, just progress.
          </AppText>
        </View>

        <Card className="w-full max-w-xs">
          <AppText variant="bodyMd" color="onSurfaceVariant" className="text-center">
            We will ask a few quick questions to personalise your reduction plan and support.
          </AppText>
        </Card>
      </View>

      <Button label="Begin setup" accessibilityLabel="Begin onboarding setup" onPress={onContinue} />
    </View>
  );
}

export interface OnboardingStepHabitsProps {
  dailyBaselinePuffs: number;
  onBack: () => void;
  onContinue: () => void;
  onChangeDailyBaselinePuffs: (value: number) => void;
}

const MIN_BASELINE_PUFFS = 10;
const MAX_BASELINE_PUFFS = 500;
const BASELINE_STEP = 10;

/**
 * Second onboarding step for capturing the user's daily puff baseline.
 *
 * @param props - Baseline value, navigation handlers, and update callback.
 * @returns Habits step with an accessible stepper control.
 */
export function OnboardingStepHabits({
  dailyBaselinePuffs,
  onBack,
  onContinue,
  onChangeDailyBaselinePuffs,
}: OnboardingStepHabitsProps) {
  const progressWidth = Math.min(100, (dailyBaselinePuffs / 300) * 100);

  const decreaseBaseline = () => {
    onChangeDailyBaselinePuffs(Math.max(MIN_BASELINE_PUFFS, dailyBaselinePuffs - BASELINE_STEP));
  };

  const increaseBaseline = () => {
    onChangeDailyBaselinePuffs(Math.min(MAX_BASELINE_PUFFS, dailyBaselinePuffs + BASELINE_STEP));
  };

  return (
    <View className="gap-stack-lg pb-stack-md">
      <View className="gap-stack-md">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back to welcome step"
          className="h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest"
          style={shadows.card}
        >
          <AppText variant="labelMd" color="onSurfaceVariant">
            Back
          </AppText>
        </Pressable>

        <View accessible accessibilityRole="header" className="gap-stack-sm">
          <AppText variant="headlineLg" color="onSurface">
            Understanding your habits
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Let us establish your baseline. Roughly how many puffs do you take on an average day?
          </AppText>
        </View>

        <Card className="items-center gap-stack-md">
          <View className="flex-row items-center gap-gutter">
            <Pressable
              onPress={decreaseBaseline}
              accessibilityRole="button"
              accessibilityLabel={`Decrease daily puffs by ${BASELINE_STEP}`}
              className="h-16 w-16 items-center justify-center rounded-full bg-surface-container"
            >
              <AppText variant="headlineMd" color="primary">
                -
              </AppText>
            </Pressable>

            <View accessible accessibilityLabel={`${dailyBaselinePuffs} puffs per day`}>
              <AppText variant="headlineXl" color="onSurface" className="text-center">
                {dailyBaselinePuffs}
              </AppText>
              <AppText variant="labelMd" color="onSurfaceVariant" className="mt-2 text-center uppercase">
                Puffs per day
              </AppText>
            </View>

            <Pressable
              onPress={increaseBaseline}
              accessibilityRole="button"
              accessibilityLabel={`Increase daily puffs by ${BASELINE_STEP}`}
              className="h-16 w-16 items-center justify-center rounded-full bg-primary-container"
            >
              <AppText variant="headlineMd" color="onPrimaryContainer">
                +
              </AppText>
            </Pressable>
          </View>

          <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${progressWidth}%` as `${number}%` }}
            />
          </View>
        </Card>

        <View className="rounded-md bg-secondary-fixed-dim/20 p-stack-sm">
          <AppText variant="bodyMd" color="onSecondaryContainer">
            It is okay to guess. Being honest with your baseline helps set a comfortable pace.
          </AppText>
        </View>
      </View>

      <Button label="Continue" accessibilityLabel="Continue to goal setting" onPress={onContinue} />
    </View>
  );
}

export type OnboardingGoalOption = 'gentle' | 'steady' | 'abrupt';

export interface OnboardingStepGoalsProps {
  dailyBaselinePuffs: number;
  selectedGoal: OnboardingGoalOption;
  startingDailyTarget: number;
  isSaving: boolean;
  onBack: () => void;
  onFinish: () => void;
  onSelectGoal: (goal: OnboardingGoalOption) => void;
}

interface GoalCardProps {
  title: string;
  subtitle: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
}

function GoalCard({ title, subtitle, description, isSelected, onPress, accentColor }: GoalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${title}. ${subtitle}. ${description}`}
      className={[
        'rounded-md bg-surface-container-lowest p-stack-md',
        isSelected ? 'border-2 border-primary bg-primary-container/10' : 'border-2 border-transparent',
      ].join(' ')}
      style={shadows.card}
    >
      <View className="gap-stack-sm">
        <View className="flex-row items-center gap-gutter">
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: accentColor }}
          >
            <AppText variant="labelMd" color="primary">
              {title.slice(0, 1)}
            </AppText>
          </View>
          <View className="flex-1">
            <AppText variant="headlineMd" color="onSurface">
              {title}
            </AppText>
            <AppText variant="labelMd" color="primary">
              {subtitle}
            </AppText>
          </View>
        </View>
        <AppText variant="bodyMd" color="onSurfaceVariant">
          {description}
        </AppText>
      </View>
    </Pressable>
  );
}

/**
 * Final onboarding step for choosing gradual or abrupt quit paths.
 *
 * @param props - Selected goal, calculated target, and completion handlers.
 * @returns Goal selection cards and finish action.
 */
export function OnboardingStepGoals({
  dailyBaselinePuffs,
  selectedGoal,
  startingDailyTarget,
  isSaving,
  onBack,
  onFinish,
  onSelectGoal,
}: OnboardingStepGoalsProps) {
  const targetLabel =
    selectedGoal === 'abrupt'
      ? 'Quit vaping today'
      : `${startingDailyTarget} puffs per day for your first week`;

  return (
    <View className="gap-stack-lg pb-stack-md">
      <View className="gap-stack-md">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back to habits step"
          className="h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest"
          style={shadows.card}
        >
          <AppText variant="labelMd" color="onSurfaceVariant">
            Back
          </AppText>
        </Pressable>

        <View accessible accessibilityRole="header" className="gap-stack-sm">
          <AppText variant="headlineLg" color="onSurface">
            Set your pace
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant">
            Choose gradual reduction or an abrupt quit path. You can change this later.
          </AppText>
        </View>

        <View className="gap-gutter">
          <GoalCard
            title="Gentle"
            subtitle="10% reduction per week"
            description="A slow, comfortable pace for building momentum without stress."
            isSelected={selectedGoal === 'gentle'}
            onPress={() => onSelectGoal('gentle')}
            accentColor={`${colors.tertiaryFixedDim}4D`}
          />
          <GoalCard
            title="Steady"
            subtitle="20% reduction per week"
            description="A balanced approach with noticeable progress week over week."
            isSelected={selectedGoal === 'steady'}
            onPress={() => onSelectGoal('steady')}
            accentColor={`${colors.primaryContainer}4D`}
          />
          <GoalCard
            title="Quit today"
            subtitle="Abrupt quit path"
            description="Stop vaping immediately with support for cravings and triggers."
            isSelected={selectedGoal === 'abrupt'}
            onPress={() => onSelectGoal('abrupt')}
            accentColor={`${colors.secondaryFixedDim}33`}
          />
        </View>

        <Card className="items-center">
          <AppText variant="labelMd" color="onSurfaceVariant" className="uppercase">
            Your starting plan
          </AppText>
          <AppText variant="headlineXl" color="primary" className="mt-2 text-center">
            {targetLabel}
          </AppText>
          <AppText variant="bodyMd" color="onSurfaceVariant" className="mt-2 text-center">
            Based on a baseline of {dailyBaselinePuffs} puffs per day
          </AppText>
        </Card>
      </View>

      <Button
        label="Get started"
        accessibilityLabel="Finish onboarding and open home dashboard"
        onPress={onFinish}
        isLoading={isSaving}
      />
    </View>
  );
}
