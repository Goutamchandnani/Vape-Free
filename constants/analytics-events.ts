/** Firebase Analytics event names used across the mobile client. */
export const ANALYTICS_EVENTS = {
  screenView: 'screen_view',
  onboardingCompleted: 'onboarding_completed',
  puffLogged: 'puff_logged',
  cravingLogged: 'craving_logged',
  chatMessageSent: 'chat_message_sent',
  chatMessageReported: 'chat_message_reported',
  offlineChatMessageSent: 'offline_chat_message_sent',
  journalEntryCreated: 'journal_entry_created',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
