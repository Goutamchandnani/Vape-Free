import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import {
  OFFLINE_SUPPORT_DISCLOSURE,
  OFFLINE_SUPPORT_FOOTER,
} from '@/constants/offline-support';

export interface OfflineSupportBannerProps {
  isOfflineMode: boolean;
}

/**
 * Explains when chat is using pre-written offline support instead of live AI.
 *
 * @param props - Whether offline companion mode is active.
 * @returns Accessible disclosure banner.
 */
export function OfflineSupportBanner({ isOfflineMode }: OfflineSupportBannerProps) {
  if (!isOfflineMode) {
    return null;
  }

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${OFFLINE_SUPPORT_DISCLOSURE} ${OFFLINE_SUPPORT_FOOTER}`}
      className="mb-stack-sm rounded-md border border-outline-variant bg-surface-container-high px-stack-sm py-base"
      testID="offline-support-banner"
    >
      <AppText variant="labelMd" color="onSurface">
        Offline support
      </AppText>
      <AppText variant="bodyMd" color="onSurfaceVariant" className="mt-1">
        {OFFLINE_SUPPORT_DISCLOSURE}
      </AppText>
      <AppText variant="labelSm" color="onSurfaceVariant" className="mt-1">
        {OFFLINE_SUPPORT_FOOTER}
      </AppText>
    </View>
  );
}
