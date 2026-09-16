import { Platform } from 'react-native';

import { ANALYTICS_EVENTS, type AnalyticsEventName } from '@/constants/analytics-events';
import { getFirebaseApp } from '@/lib/firebase-client';
import { getAnalytics, initializeAnalytics, isSupported, logEvent } from '@/lib/firebase-native';

let analyticsReady = false;
let analyticsInitAttempted = false;

/**
 * Initialises Firebase Analytics when supported (web production builds).
 */
export async function initializeAnalyticsService(): Promise<void> {
  if (analyticsInitAttempted) {
    return;
  }

  analyticsInitAttempted = true;

  if (Platform.OS !== 'web') {
    return;
  }

  try {
    const supported = await isSupported();

    if (!supported) {
      return;
    }

    initializeAnalytics(getFirebaseApp());
    analyticsReady = true;
  } catch (error) {
    console.warn('Firebase Analytics initialisation skipped.', error);
  }
}

/**
 * Records a custom analytics event when Analytics is available.
 *
 * @param name - Event name from ANALYTICS_EVENTS or a custom string.
 * @param params - Optional event parameters.
 */
export function trackAnalyticsEvent(
  name: AnalyticsEventName | string,
  params?: Record<string, string | number | boolean>,
): void {
  if (__DEV__) {
    console.info('[analytics]', name, params ?? {});
  }

  if (!analyticsReady) {
    return;
  }

  try {
    logEvent(getAnalytics(getFirebaseApp()), name, params);
  } catch (error) {
    console.warn('Analytics event skipped.', error);
  }
}

/**
 * Records a screen view for navigation analytics.
 *
 * @param screenName - Human-readable screen identifier.
 */
export function trackAnalyticsScreen(screenName: string): void {
  trackAnalyticsEvent(ANALYTICS_EVENTS.screenView, {
    screen_name: screenName,
    platform: Platform.OS,
  });
}

export { ANALYTICS_EVENTS };
