import { render, screen } from '@testing-library/react-native';

import { OfflineSupportBanner } from '@/components/chat/offline-support-banner';

describe('OfflineSupportBanner', () => {
  it('renders disclosure copy when offline mode is active', () => {
    render(<OfflineSupportBanner isOfflineMode />);

    expect(screen.getByText('Offline support')).toBeTruthy();
    expect(screen.getByTestId('offline-support-banner')).toBeTruthy();
  });

  it('renders nothing when online mode is active', () => {
    render(<OfflineSupportBanner isOfflineMode={false} />);

    expect(screen.queryByTestId('offline-support-banner')).toBeNull();
  });
});
