import type { ReactNode } from 'react';
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, MIN_TOUCH_TARGET } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  accessibilityLabel?: string;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; textColor: keyof typeof colors; indicator: string }
> = {
  primary: {
    container: 'bg-primary',
    textColor: 'onPrimary',
    indicator: colors.onPrimary,
  },
  secondary: {
    container: 'bg-secondary-container',
    textColor: 'onSecondaryContainer',
    indicator: colors.onSecondaryContainer,
  },
  tertiary: {
    container: 'bg-tertiary-container',
    textColor: 'onTertiaryContainer',
    indicator: colors.onTertiaryContainer,
  },
  ghost: {
    container: 'bg-transparent border border-outline-variant',
    textColor: 'onSurface',
    indicator: colors.onSurface,
  },
};

/**
 * Accessible pill-shaped button with a 44pt minimum touch target (WCAG 2.1 AA).
 *
 * @param props - Label, variant, loading state, and Pressable passthrough props.
 * @returns Pressable button suitable for primary actions.
 */
export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  accessibilityLabel,
  className,
  style,
  ...rest
}: ButtonProps & { className?: string }) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading;
  const baseStyle: ViewStyle = {
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
    opacity: isDisabled ? 0.6 : 1,
  };

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={(state) => [baseStyle, typeof style === 'function' ? style(state) : style]}
    >
      <View
        className={[
          'rounded-full px-stack-md py-base items-center justify-center',
          styles.container,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isLoading ? (
          <ActivityIndicator color={styles.indicator} accessibilityLabel="Loading" />
        ) : (
          <AppText variant="labelMd" color={styles.textColor}>
            {label}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

/**
 * Ensures icon-only controls still meet minimum touch target requirements.
 */
export function IconButtonContainer({ children }: { children: ReactNode }) {
  return (
    <View
      className="items-center justify-center"
      style={{ minHeight: MIN_TOUCH_TARGET, minWidth: MIN_TOUCH_TARGET }}
    >
      {children}
    </View>
  );
}
