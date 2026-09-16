/** Intents recognised by the offline support companion. */
export type OfflineSupportIntent =
  | 'craving'
  | 'relapse'
  | 'stress'
  | 'motivation'
  | 'lonely'
  | 'boredom'
  | 'general';

export interface OfflineSupportIntentDefinition {
  id: OfflineSupportIntent;
  patterns: RegExp[];
  responses: readonly string[];
}

/** Pre-written offline responses reviewed for supportive, non-clinical tone. */
export const OFFLINE_SUPPORT_INTENTS: readonly OfflineSupportIntentDefinition[] = [
  {
    id: 'craving',
    patterns: [/crav/i, /urge/i, /want to vape/i, /need a puff/i, /nicotine/i],
    responses: [
      'Cravings often peak within a few minutes. Try sipping water or taking ten slow breaths while the wave passes.',
      'A craving is uncomfortable, but it will fade. You have got through these before.',
      'Step away for two minutes if you can. Changing your environment can loosen the urge.',
    ],
  },
  {
    id: 'relapse',
    patterns: [/slip/i, /relapse/i, /failed/i, /messed up/i, /logged a puff/i, /gave in/i],
    responses: [
      'One slip does not erase your progress. What matters is what you do next.',
      'Be gentle with yourself. Notice what happened, then choose your next small step.',
      'Setbacks are common on this journey. You can return to your plan right now.',
    ],
  },
  {
    id: 'stress',
    patterns: [/stress/i, /anx/i, /overwhelm/i, /panic/i, /worried/i, /pressure/i],
    responses: [
      'Stress can make cravings louder. Try box breathing: in for four, hold for four, out for four.',
      'You do not have to fix everything today. One calm breath is enough for this moment.',
      'If stress feels heavy, jot a few words in Journal or log how intense it feels on Track.',
    ],
  },
  {
    id: 'motivation',
    patterns: [/motivat/i, /keep going/i, /why am i/i, /point of/i, /give up/i, /quit/i],
    responses: [
      'Every day you track is data you can learn from, even when progress feels slow.',
      'You started because breathing easier matters to you. That reason still counts.',
      'Small wins add up. Check Progress to see how far you have already come.',
    ],
  },
  {
    id: 'lonely',
    patterns: [/alone/i, /lonely/i, /no one/i, /nobody/i, /isolated/i],
    responses: [
      'You are not doing this in silence. This companion is here, and your logs show you are trying.',
      'When you reconnect, Support chat can offer more personalised encouragement.',
      'Consider reaching out to someone you trust, even with a short message.',
    ],
  },
  {
    id: 'boredom',
    patterns: [/bored/i, /nothing to do/i, /habit/i, /routine/i, /hands/i],
    responses: [
      'Boredom cravings are real. Try occupying your hands with a drink, snack, or short walk.',
      'Notice when boredom usually hits. Planning one alternative activity can help next time.',
      'Track when the urge appears so you can spot the pattern over time.',
    ],
  },
  {
    id: 'general',
    patterns: [],
    responses: [
      'I am here with you. This is offline support with pre-written encouragement, not live AI.',
      'You are doing something hard, and checking in takes courage.',
      'Try logging how you feel on Track or writing a few lines in Journal while you are offline.',
    ],
  },
] as const;

export const OFFLINE_SUPPORT_DISCLOSURE =
  'You are offline. Replies come from pre-written supportive messages, not live AI. Reconnect for Gemini support.';

export const OFFLINE_SUPPORT_FOOTER =
  'If you are in crisis, contact Samaritans on 116 123 or NHS 111.';
