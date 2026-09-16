import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/theme';

export interface TriggerChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Selectable trigger tag chip for craving logging.
 *
 * @param props - Label, selection state, and press handler.
 * @returns Accessible toggle chip.
 */
export function TriggerChip({ label, isSelected, onPress }: TriggerChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label} trigger${isSelected ? ', selected' : ''}`}
    >
      <View
        className={[
          'rounded-full border px-stack-sm py-base',
          isSelected ? 'border-primary bg-primary-container/20' : 'border-outline-variant bg-surface',
        ].join(' ')}
      >
        <AppText variant="labelMd" color={isSelected ? 'primary' : 'onSurface'}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

export interface IntensitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Five-point craving intensity selector.
 *
 * @param props - Current intensity and change handler.
 * @returns Row of intensity buttons.
 */
export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-gutter">
      {[1, 2, 3, 4, 5].map((level) => {
        const isSelected = value === level;

        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Craving intensity ${level} of 5`}
          >
            <View
              className={[
                'h-12 min-w-12 items-center justify-center rounded-full px-base',
                isSelected ? 'bg-primary' : 'bg-surface-container',
              ].join(' ')}
            >
              <AppText variant="labelMd" color={isSelected ? 'onPrimary' : 'onSurface'}>
                {level}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface PuffLogButtonProps {
  isSaving: boolean;
  onPress: () => void;
}

/**
 * Primary one-puff logging button from the Track wireframe.
 *
 * @param props - Saving state and press handler.
 * @returns Large circular log action.
 */
export function PuffLogButton({ isSaving, onPress }: PuffLogButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isSaving}
      accessibilityRole="button"
      accessibilityLabel="Log one puff"
      accessibilityState={{ disabled: isSaving, busy: isSaving }}
      testID="track-log-puff-button"
      style={{
        alignSelf: 'center',
        shadowColor: colors.shadowTint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View className="h-48 w-48 items-center justify-center rounded-full bg-primary-container">
        <AppText variant="headlineMd" color="onPrimaryContainer">
          {isSaving ? 'Saving...' : '1 Puff'}
        </AppText>
        <AppText variant="bodyMd" color="onPrimaryContainer" className="mt-2">
          Tap to log
        </AppText>
      </View>
    </Pressable>
  );
}
