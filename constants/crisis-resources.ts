/**
 * UK crisis and clinical escalation resources surfaced by the AI safety layer.
 * Required by dissertation AI safety requirements for server-side detection.
 */

export const SAMARITANS_PHONE = '116123';
export const SAMARITANS_LABEL = 'Samaritans';

export const NHS_111_PHONE = '111';
export const NHS_111_LABEL = 'NHS 111';

export const CRISIS_RESOURCES = [
  {
    id: 'samaritans',
    label: SAMARITANS_LABEL,
    phone: SAMARITANS_PHONE,
    accessibilityLabel: 'Call Samaritans on 116 123',
  },
  {
    id: 'nhs-111',
    label: NHS_111_LABEL,
    phone: NHS_111_PHONE,
    accessibilityLabel: 'Call NHS 111',
  },
] as const;
