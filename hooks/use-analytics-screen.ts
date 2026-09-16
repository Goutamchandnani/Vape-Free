import { usePathname } from 'expo-router';
import { useEffect } from 'react';

import { trackAnalyticsScreen } from '@/lib/analytics-service';

const SCREEN_NAMES: Record<string, string> = {
  '/': 'Home',
  '/track': 'Track',
  '/progress': 'Progress',
  '/journal': 'Journal',
  '/chat': 'Support Chat',
  '/onboarding': 'Onboarding',
  '/reframe': 'Supportive Reframe',
};

/**
 * Maps Expo Router paths to analytics screen names and records screen_view events.
 */
export function useAnalyticsScreen(): void {
  const pathname = usePathname();

  useEffect(() => {
    const screenName = SCREEN_NAMES[pathname] ?? pathname;
    trackAnalyticsScreen(screenName);
  }, [pathname]);
}
