import { EMULATOR_FIREBASE_CONFIG } from '@/constants/firebase-emulator';
import { getFirebaseClientConfig } from '@/lib/firebase-config';
import { getAuthEmulatorUrl } from '@/lib/should-use-firebase-emulators';

describe('firebase emulator config', () => {
  it('returns demo config when emulators are enabled in .env', () => {
    expect(process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS).toBe('true');
    expect(getFirebaseClientConfig()).toEqual({
      ...EMULATOR_FIREBASE_CONFIG,
      projectId: 'vapefree-msc',
    });
  });

  it('builds the auth emulator URL from host', () => {
    expect(getAuthEmulatorUrl('127.0.0.1')).toBe('http://127.0.0.1:9099');
  });
});
