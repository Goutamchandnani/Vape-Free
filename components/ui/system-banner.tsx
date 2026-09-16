import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import type { FirebaseInitStatus } from '@/lib/firebase-init-state';

export interface SystemBannerProps {
  status: FirebaseInitStatus;
  message: string | null;
}

function getBannerCopy(status: FirebaseInitStatus, message: string | null): string | null {
  if (message) {
    return message;
  }

  switch (status) {
    case 'memory_cache':
      return 'Offline cache is limited in this preview build. Your logs still save while you are online.';
    case 'failed':
      return 'Cloud sync is unavailable right now. You can keep using the app, but new data may not save.';
    default:
      return null;
  }
}

/**
 * Global banner for Firebase initialisation or offline cache limitations.
 *
 * @param props - Firebase init status and optional override message.
 * @returns Accessible warning banner when action is needed.
 */
export function SystemBanner({ status, message }: SystemBannerProps) {
  const copy = getBannerCopy(status, message);

  if (!copy || status === 'ready') {
    return null;
  }

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      className={[
        'border-b px-container-padding py-base',
        status === 'failed' ? 'border-error bg-error-container' : 'border-outline-variant bg-surface-container-high',
      ].join(' ')}
    >
      <AppText variant="labelMd" color={status === 'failed' ? 'error' : 'onSurfaceVariant'}>
        {copy}
      </AppText>
    </View>
  );
}
