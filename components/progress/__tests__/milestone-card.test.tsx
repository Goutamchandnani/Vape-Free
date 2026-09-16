import { render, screen } from '@testing-library/react-native';

import { MilestoneCard } from '@/components/progress/milestone-card';
import type { MilestoneStatus } from '@/lib/milestones';

const unlockedMilestone: MilestoneStatus = {
  id: 'streak-3',
  kind: 'streak',
  title: '3-day streak',
  subtitle: 'Three days of progress',
  icon: 'flame-outline',
  threshold: 3,
  isUnlocked: true,
  progressValue: 3,
};

const lockedMilestone: MilestoneStatus = {
  id: 'streak-7',
  kind: 'streak',
  title: '7-day streak',
  subtitle: 'One week smoke-free',
  icon: 'flame-outline',
  threshold: 7,
  isUnlocked: false,
  progressValue: 4,
};

describe('MilestoneCard', () => {
  it('renders unlocked milestone details', () => {
    render(<MilestoneCard milestone={unlockedMilestone} />);

    expect(screen.getByText('3-day streak')).toBeTruthy();
    expect(screen.getByText('Three days of progress')).toBeTruthy();
    expect(screen.getByLabelText(/Unlocked/)).toBeTruthy();
  });

  it('renders locked milestone progress label', () => {
    render(<MilestoneCard milestone={lockedMilestone} />);

    expect(screen.getByText('7-day streak')).toBeTruthy();
    expect(screen.getByLabelText(/Locked/)).toBeTruthy();
    expect(screen.getByText('4 / 7 days')).toBeTruthy();
  });
});
