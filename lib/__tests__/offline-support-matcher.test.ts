import {
  detectCrisisLanguage,
  detectMedicalAdviceRequest,
  CRISIS_RESPONSE,
  MEDICAL_RESPONSE,
} from '@/lib/chat-safety';
import { matchOfflineSupportMessage } from '@/lib/offline-support-matcher';

describe('chat-safety', () => {
  it('detects crisis language', () => {
    expect(detectCrisisLanguage('I want to end my life')).toBe(true);
    expect(detectCrisisLanguage('I feel stressed')).toBe(false);
  });

  it('detects medical advice requests', () => {
    expect(detectMedicalAdviceRequest('Can you diagnose my symptoms?')).toBe(true);
    expect(detectMedicalAdviceRequest('I have a craving')).toBe(false);
  });
});

describe('offline-support-matcher', () => {
  it('returns crisis response for crisis language', () => {
    const match = matchOfflineSupportMessage('I want to kill myself');

    expect(match.response).toBe(CRISIS_RESPONSE);
    expect(match.safetyFlags.hasCrisisLanguage).toBe(true);
  });

  it('returns medical response for clinical requests', () => {
    const match = matchOfflineSupportMessage('What prescription should I take?');

    expect(match.response).toBe(MEDICAL_RESPONSE);
    expect(match.safetyFlags.hasMedicalAdviceRequest).toBe(true);
  });

  it('matches craving intent copy', () => {
    const match = matchOfflineSupportMessage('I have a strong craving right now');

    expect(match.intent).toBe('craving');
    expect(match.response.toLowerCase()).toContain('craving');
  });

  it('falls back to general supportive copy', () => {
    const match = matchOfflineSupportMessage('Hello there');

    expect(match.intent).toBe('general');
    expect(match.response.length).toBeGreaterThan(0);
  });
});
