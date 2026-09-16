import { createAppError, toAppError } from '@/lib/create-app-error';

describe('create-app-error', () => {
  it('creates typed errors with default copy', () => {
    const error = createAppError('network_unavailable');
    expect(error.code).toBe('network_unavailable');
    expect(error.isRetryable).toBe(false);
    expect(error.message).toMatch(/offline/i);
  });

  it('maps network failures from unknown errors', () => {
    const error = toAppError(new Error('Network request failed'));
    expect(error.code).toBe('network_unavailable');
    expect(error.isRetryable).toBe(true);
  });

  it('returns existing AppError instances unchanged', () => {
    const original = createAppError('chat_failed', 'Custom message', true);
    expect(toAppError(original)).toEqual(original);
  });
});
