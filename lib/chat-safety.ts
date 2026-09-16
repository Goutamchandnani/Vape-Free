const CRISIS_PATTERNS = [/suicide/i, /kill myself/i, /self harm/i, /end my life/i];
const MEDICAL_PATTERNS = [/diagnose/i, /prescription/i, /medication dose/i, /is it safe to/i];

export const CRISIS_RESPONSE =
  'I am really sorry you are feeling this way. Please contact Samaritans on 116 123 or NHS 111 for urgent support.';

export const MEDICAL_RESPONSE =
  'I cannot provide medical advice. Please speak with a GP, pharmacist, or other qualified healthcare professional.';

/**
 * Detects crisis language for client-side offline support escalation.
 *
 * @param text - User message content.
 * @returns True when crisis patterns are detected.
 */
export function detectCrisisLanguage(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Detects requests for clinical advice that must be deflected offline.
 *
 * @param text - User message content.
 * @returns True when medical advice patterns are detected.
 */
export function detectMedicalAdviceRequest(text: string): boolean {
  return MEDICAL_PATTERNS.some((pattern) => pattern.test(text));
}
