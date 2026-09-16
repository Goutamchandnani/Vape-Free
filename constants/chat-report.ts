/** Predefined reasons shown when a user reports an assistant message. */
export const CHAT_REPORT_REASONS = [
  { id: 'harmful_advice', label: 'Harmful or unsafe advice' },
  { id: 'off_topic', label: 'Off-topic or unhelpful' },
  { id: 'inaccurate', label: 'Inaccurate information' },
  { id: 'other', label: 'Other concern' },
] as const;

export type ChatReportReasonId = (typeof CHAT_REPORT_REASONS)[number]['id'];
