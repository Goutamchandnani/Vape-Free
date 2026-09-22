import { Image, type ImageStyle, type StyleProp } from 'react-native';

/** Shared VapeFree brand mark used on splash, onboarding, and headers. */
const logoSource = require('@/assets/images/vapefree-logo.png');

export interface VapeFreeLogoProps {
  /** Width and height in density-independent points. */
  size?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
  testID?: string;
}

/**
 * Renders the VapeFree heart-and-leaf logo at a consistent aspect ratio.
 *
 * @param props - Display size and accessibility options.
 * @returns Brand logo image.
 */
export function VapeFreeLogo({
  size = 128,
  accessibilityLabel = 'VapeFree logo',
  style,
  testID = 'vapefree-logo',
}: VapeFreeLogoProps) {
  return (
    <Image
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors
      testID={testID}
      source={logoSource}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
}
