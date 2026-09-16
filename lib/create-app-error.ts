import type { AppError, AppErrorCode } from '@/types';

const DEFAULT_MESSAGES: Record<AppErrorCode, string> = {
  network_unavailable:
    'You appear to be offline. Your changes are saved on this device and will sync when you reconnect.',
  auth_failed: 'We could not sign you in. Please check your details and try again.',
  permission_denied: 'You do not have permission to access this data.',
  sync_failed: 'We could not sync your latest changes. They remain saved on this device.',
  chat_failed: 'The support chat is unavailable right now. Please try again in a moment.',
  validation_failed: 'Some information looks incorrect. Please review and try again.',
  unknown: 'Something went wrong. Please try again.',
};

/**
 * Builds a typed, user-facing application error with a retry hint.
 *
 * @param code - Stable error code used for analytics and UI branching.
 * @param message - Optional override for the default plain-language copy.
 * @param isRetryable - Whether the UI should offer a retry action.
 * @returns Normalised error object for presentation layers.
 */
export function createAppError(
  code: AppErrorCode,
  message?: string,
  isRetryable = false,
): AppError {
  return {
    code,
    message: message ?? DEFAULT_MESSAGES[code],
    isRetryable,
  };
}

/**
 * Maps unknown thrown values to a safe AppError for UI handling.
 *
 * @param error - Value caught from async operations.
 * @returns Normalised AppError, never exposing raw stack traces to users.
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    const normalizedMessage = error.message.toLowerCase();

    if (normalizedMessage.includes('network') || normalizedMessage.includes('offline')) {
      return createAppError('network_unavailable', undefined, true);
    }

    if (normalizedMessage.includes('permission')) {
      return createAppError('permission_denied');
    }
  }

  return createAppError('unknown', undefined, true);
}

function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'isRetryable' in value
  );
}
