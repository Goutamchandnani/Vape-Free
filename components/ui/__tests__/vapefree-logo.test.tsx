import { render, screen } from '@testing-library/react-native';

import { VapeFreeLogo } from '@/components/ui/vapefree-logo';

describe('VapeFreeLogo', () => {
  it('renders with the expected accessibility label', () => {
    render(<VapeFreeLogo size={80} />);

    expect(screen.getByLabelText('VapeFree logo')).toBeTruthy();
    expect(screen.getByTestId('vapefree-logo')).toBeTruthy();
  });
});
