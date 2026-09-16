import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typography, type TypographyToken } from '@/constants/theme';

export interface AppTextProps extends RNTextProps {
  variant?: TypographyToken;
  color?: keyof typeof colors;
  /** When true, caps system font scaling for dense UI labels. */
  limitFontScaling?: boolean;
}

/**
 * Typography primitive mapped to the VapeFree design system tokens.
 *
 * @param props - React Native Text props plus variant and colour tokens.
 * @returns Styled text that scales with system font settings.
 */
export function AppText({
  variant = 'bodyMd',
  color = 'onSurface',
  style,
  limitFontScaling = false,
  allowFontScaling = true,
  maxFontSizeMultiplier,
  ...rest
}: AppTextProps) {
  const token = typography[variant];

  return (
    <RNText
      {...rest}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={
        maxFontSizeMultiplier ?? (limitFontScaling ? 1.3 : 2)
      }
      style={[
        {
          fontFamily: token.fontFamily,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          letterSpacing: 'letterSpacing' in token ? token.letterSpacing : undefined,
          color: colors[color],
        },
        style,
      ]}
    />
  );
}
