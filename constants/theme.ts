/**
 * Design tokens from the VapeFree Stitch design system.
 * Components must reference these names, not raw hex values.
 */

/** WCAG 2.1 AA minimum touch target in density-independent points. */
export const MIN_TOUCH_TARGET = 44;

/** Matches tabBarStyle.minHeight in app/(tabs)/_layout.tsx. */
export const TAB_BAR_HEIGHT = 56;

export const colors = {
  surface: '#fbf9f6',
  surfaceDim: '#dbdad7',
  surfaceBright: '#fbf9f6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f0',
  surfaceContainer: '#efeeeb',
  surfaceContainerHigh: '#eae8e5',
  surfaceContainerHighest: '#e4e2df',
  onSurface: '#1b1c1a',
  onSurfaceVariant: '#3e4947',
  inverseSurface: '#30312f',
  inverseOnSurface: '#f2f0ed',
  outline: '#6e7977',
  outlineVariant: '#bec9c6',
  surfaceTint: '#006a63',
  primary: '#006a63',
  onPrimary: '#ffffff',
  primaryContainer: '#5baea5',
  onPrimaryContainer: '#003f3a',
  inversePrimary: '#82d5cb',
  secondary: '#8d4d36',
  onSecondary: '#ffffff',
  secondaryContainer: '#fdaa8d',
  onSecondaryContainer: '#783c27',
  tertiary: '#3b6847',
  onTertiary: '#ffffff',
  tertiaryContainer: '#7cab86',
  onTertiaryContainer: '#113f23',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  primaryFixed: '#9ef2e7',
  primaryFixedDim: '#82d5cb',
  onPrimaryFixed: '#00201d',
  onPrimaryFixedVariant: '#00504a',
  secondaryFixed: '#ffdbcf',
  secondaryFixedDim: '#ffb59c',
  onSecondaryFixed: '#390c00',
  onSecondaryFixedVariant: '#703621',
  tertiaryFixed: '#bcefc5',
  tertiaryFixedDim: '#a1d2aa',
  onTertiaryFixed: '#00210d',
  onTertiaryFixedVariant: '#234f31',
  background: '#fbf9f6',
  onBackground: '#1b1c1a',
  surfaceVariant: '#e4e2df',
  inputBackground: '#f0ede9',
  shadowTint: '#5baea5',
} as const;

export const spacing = {
  base: 8,
  gutter: 16,
  stackSm: 12,
  stackMd: 24,
  stackLg: 48,
  containerPadding: 24,
} as const;

export const borderRadius = {
  sm: 8,
  default: 16,
  md: 24,
  lg: 32,
  xl: 48,
  full: 9999,
} as const;

export const typography = {
  headlineXl: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.72,
  },
  headlineLg: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 28,
    lineHeight: 36,
  },
  headlineLgMobile: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  headlineMd: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: 'Quicksand_500Medium',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  labelSm: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: colors.shadowTint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
