import { buildUserProfileFromOnboarding } from '@/lib/build-user-profile-from-onboarding';
import type { StoredOnboardingProfile } from '@/lib/onboarding-storage';

describe('buildUserProfileFromOnboarding', () => {
  const onboarding: StoredOnboardingProfile = {
    quitPath: 'gradual',
    reductionPace: 'gentle',
    dailyBaselinePuffs: 150,
    startingDailyTarget: 135,
    targetQuitDate: null,
    onboardingCompleted: true,
    completedAt: '2026-09-06T12:00:00.000Z',
  };

  it('maps onboarding selections onto a user-owned Firestore profile', () => {
    const profile = buildUserProfileFromOnboarding('user-123', onboarding, {
      createdAt: '2026-09-06T11:00:00.000Z',
    });

    expect(profile).toMatchObject({
      id: 'user-123',
      userId: 'user-123',
      participantId: null,
      quitPath: 'gradual',
      reductionPace: 'gentle',
      dailyBaselinePuffs: 150,
      startingDailyTarget: 135,
      onboardingCompleted: true,
      completedAt: '2026-09-06T12:00:00.000Z',
      createdAt: '2026-09-06T11:00:00.000Z',
      isPendingSync: false,
    });
  });
});
