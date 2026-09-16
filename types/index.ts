/** ISO 8601 timestamp string used across Firestore documents. */
export type IsoTimestamp = string;

/** Base fields shared by user-owned Firestore documents. */
export interface UserOwnedDocument {
  id: string;
  userId: string;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  /** True when the write is queued locally and not yet confirmed by the server. */
  isPendingSync: boolean;
}

/** Pseudonymised research profile stored separately from behavioural data. */
export interface ResearchProfile {
  participantId: string;
  authUid: string;
  createdAt: IsoTimestamp;
}

/** Onboarding path selected during adaptive onboarding. */
export type QuitPath = 'gradual' | 'abrupt';

/** Gradual reduction speed selected during onboarding. */
export type ReductionPace = 'gentle' | 'steady';

export interface UserProfile extends UserOwnedDocument {
  /** Pseudonymised participant id linked via researchProfiles for exports. */
  participantId: string | null;
  displayName: string | null;
  quitPath: QuitPath | null;
  reductionPace: ReductionPace | null;
  dailyBaselinePuffs: number | null;
  startingDailyTarget: number | null;
  targetQuitDate: IsoTimestamp | null;
  onboardingCompleted: boolean;
  completedAt: IsoTimestamp | null;
}

export type CravingIntensity = 1 | 2 | 3 | 4 | 5;

export interface CravingLog extends UserOwnedDocument {
  intensity: CravingIntensity;
  triggerTags: string[];
  notes: string | null;
  resisted: boolean;
  loggedAt: IsoTimestamp;
}

export interface VapingSessionLog extends UserOwnedDocument {
  puffCount: number;
  nicotineMg: number | null;
  loggedAt: IsoTimestamp;
  notes: string | null;
}

export interface JournalEntry extends UserOwnedDocument {
  body: string;
  moodTag: string | null;
  loggedAt: IsoTimestamp;
}

export type ChatRole = 'user' | 'assistant' | 'system';

/** Where a support message originated. Offline companion messages stay on-device. */
export type ChatSupportSource = 'cloud' | 'offline_companion';

export interface ChatMessage extends UserOwnedDocument {
  conversationId: string;
  role: ChatRole;
  content: string;
  /** Cloud Gemini vs offline pre-written companion. */
  supportSource?: ChatSupportSource;
  /** Set when the user reports an assistant message as inappropriate. */
  isReported: boolean;
  reportReason: string | null;
  safetyFlags: ChatSafetyFlags;
}

export interface ChatSafetyFlags {
  hasCrisisLanguage: boolean;
  hasMedicalAdviceRequest: boolean;
}

/** Request body sent to the Gemini Cloud Function. */
export interface ChatCompletionRequest {
  conversationId: string;
  message: string;
}

/** Response body returned by the Gemini Cloud Function. */
export interface ChatCompletionResponse {
  messageId: string;
  content: string;
  safetyFlags: ChatSafetyFlags;
  crisisResourcesShown: boolean;
}

/** Typed Firebase client configuration (public keys only). */
export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export type AppErrorCode =
  | 'network_unavailable'
  | 'auth_failed'
  | 'permission_denied'
  | 'sync_failed'
  | 'chat_failed'
  | 'validation_failed'
  | 'unknown';

export interface AppError {
  code: AppErrorCode;
  message: string;
  isRetryable: boolean;
}
