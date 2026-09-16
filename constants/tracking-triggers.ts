/** Trigger tags shown on the craving log screen. */
export const CRAVING_TRIGGER_TAGS = [
  'Stress',
  'Boredom',
  'Social',
  'After meal',
  'Work break',
] as const;

export type CravingTriggerTag = (typeof CRAVING_TRIGGER_TAGS)[number];

/** Labels for craving intensity levels 1 to 5. */
export const CRAVING_INTENSITY_LABELS: Record<number, string> = {
  1: 'Mild',
  2: 'Low',
  3: 'Moderate',
  4: 'Strong',
  5: 'Intense',
};
