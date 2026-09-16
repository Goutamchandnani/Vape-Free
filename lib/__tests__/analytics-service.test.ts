jest.mock('@/lib/firebase-client', () => ({
  getFirebaseApp: jest.fn(),
}));

jest.mock('@/lib/firebase-native', () => ({
  getAnalytics: jest.fn(),
  initializeAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(false),
  logEvent: jest.fn(),
}));

import { ANALYTICS_EVENTS, trackAnalyticsEvent } from '@/lib/analytics-service';

describe('analytics-service', () => {
  it('logs events in development without throwing', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

    expect(() => {
      trackAnalyticsEvent(ANALYTICS_EVENTS.puffLogged, { puff_count: 1 });
    }).not.toThrow();

    expect(infoSpy).toHaveBeenCalledWith('[analytics]', ANALYTICS_EVENTS.puffLogged, {
      puff_count: 1,
    });

    infoSpy.mockRestore();
  });
});
