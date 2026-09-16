import { isAuthAlreadyInitializedError } from '@/lib/is-auth-already-initialized-error';

describe('isAuthAlreadyInitializedError', () => {
  it('returns true for duplicate Auth initialisation errors', () => {
    expect(isAuthAlreadyInitializedError(new Error('Firebase Auth already initialized'))).toBe(true);
    expect(isAuthAlreadyInitializedError(new Error('Auth instance already exists'))).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isAuthAlreadyInitializedError(new Error('Component auth has not been registered'))).toBe(
      false,
    );
  });
});
