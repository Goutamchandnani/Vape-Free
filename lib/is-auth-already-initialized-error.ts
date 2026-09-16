/**
 * Returns true when initializeAuth failed because Auth was already set up.
 *
 * @param error - Error thrown by initializeAuth.
 * @returns Whether getAuth can safely be used as a fallback.
 */
export function isAuthAlreadyInitializedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('already initialized') || message.includes('already exists');
}
