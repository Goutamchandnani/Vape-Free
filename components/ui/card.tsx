import { View, type ViewProps } from 'react-native';

import { shadows } from '@/constants/theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Elevated surface card using ambient shadow tokens from the design system.
 *
 * @param props - Standard View props plus card content.
 * @returns Non-bordered card container with soft elevation.
 */
export function Card({ children, className, style, ...rest }: CardProps & { className?: string }) {
  return (
    <View
      {...rest}
      className={['rounded-md bg-surface-container-lowest p-stack-md', className]
        .filter(Boolean)
        .join(' ')}
      style={[shadows.card, style]}
    >
      {children}
    </View>
  );
}
