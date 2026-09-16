/** Estimated cost per puff used for savings milestones (GBP). */
export const PUFF_COST_GBP = 0.12;

export type MilestoneKind =
  | 'streak'
  | 'money'
  | 'cravings_resisted'
  | 'reduction'
  | 'zero_puff_streak'
  | 'cravings_logged';

export interface MilestoneDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  kind: MilestoneKind;
  threshold: number;
}

export const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  {
    id: 'first-day',
    title: 'First 24 Hours',
    subtitle: 'You showed up for yourself.',
    icon: 'timer-outline',
    kind: 'streak',
    threshold: 1,
  },
  {
    id: 'first-resist',
    title: 'Urge Under Control',
    subtitle: 'You chose you over the craving.',
    icon: 'shield-checkmark-outline',
    kind: 'cravings_resisted',
    threshold: 1,
  },
  {
    id: 'clean-slate',
    title: 'Clean Slate',
    subtitle: 'A full day vape-free.',
    icon: 'sunny-outline',
    kind: 'zero_puff_streak',
    threshold: 1,
  },
  {
    id: 'saved-five',
    title: 'Saved £5',
    subtitle: 'Small wins add up fast.',
    icon: 'cash-outline',
    kind: 'money',
    threshold: 5,
  },
  {
    id: 'three-day-spark',
    title: 'Three Day Spark',
    subtitle: 'Momentum is building.',
    icon: 'flame-outline',
    kind: 'streak',
    threshold: 3,
  },
  {
    id: 'pattern-spotter',
    title: 'Pattern Spotter',
    subtitle: 'You are learning your triggers.',
    icon: 'search-outline',
    kind: 'cravings_logged',
    threshold: 5,
  },
  {
    id: 'deep-breath',
    title: 'Deep Breath Hero',
    subtitle: 'Five cravings conquered.',
    icon: 'leaf-outline',
    kind: 'cravings_resisted',
    threshold: 5,
  },
  {
    id: 'one-week',
    title: 'One Week Strong',
    subtitle: 'Seven days of real progress.',
    icon: 'calendar-outline',
    kind: 'streak',
    threshold: 7,
  },
  {
    id: 'reduction-ten',
    title: '10% Lighter',
    subtitle: 'Your daily puffs are dropping.',
    icon: 'trending-down-outline',
    kind: 'reduction',
    threshold: 10,
  },
  {
    id: 'saved-twenty',
    title: 'Saved £20',
    subtitle: 'Your wallet is thanking you.',
    icon: 'wallet-outline',
    kind: 'money',
    threshold: 20,
  },
  {
    id: 'clean-three',
    title: 'Three Clean Days',
    subtitle: 'Three days in a row vape-free.',
    icon: 'sparkles-outline',
    kind: 'zero_puff_streak',
    threshold: 3,
  },
  {
    id: 'craving-crusher',
    title: 'Craving Crusher',
    subtitle: 'Ten urges, ten victories.',
    icon: 'fitness-outline',
    kind: 'cravings_resisted',
    threshold: 10,
  },
  {
    id: 'fortnight-fighter',
    title: 'Fortnight Fighter',
    subtitle: 'Two weeks of steady effort.',
    icon: 'medal-outline',
    kind: 'streak',
    threshold: 14,
  },
  {
    id: 'reduction-twenty-five',
    title: '25% Reduction',
    subtitle: 'A quarter less than before.',
    icon: 'analytics-outline',
    kind: 'reduction',
    threshold: 25,
  },
  {
    id: 'saved-fifty',
    title: 'Saved £50',
    subtitle: 'Treat yourself — you earned it.',
    icon: 'gift-outline',
    kind: 'money',
    threshold: 50,
  },
  {
    id: 'halfway-hero',
    title: 'Halfway Hero',
    subtitle: 'Half your old habit, gone.',
    icon: 'rocket-outline',
    kind: 'reduction',
    threshold: 50,
  },
  {
    id: 'one-month',
    title: 'One Month Milestone',
    subtitle: 'Thirty days of commitment.',
    icon: 'ribbon-outline',
    kind: 'streak',
    threshold: 30,
  },
  {
    id: 'unshakeable',
    title: 'Unshakeable',
    subtitle: 'Twenty-five cravings resisted.',
    icon: 'diamond-outline',
    kind: 'cravings_resisted',
    threshold: 25,
  },
];
