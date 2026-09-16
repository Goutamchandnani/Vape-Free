import { createTrackingDocumentId } from '@/lib/tracking-utils';
import type { CravingIntensity, CravingLog, IsoTimestamp, VapingSessionLog } from '@/types';

export interface CreateVapingSessionInput {
  userId: string;
  puffCount: number;
  notes?: string | null;
  loggedAt?: IsoTimestamp;
}

export interface CreateCravingLogInput {
  userId: string;
  intensity: CravingIntensity;
  triggerTags: string[];
  resisted: boolean;
  notes?: string | null;
  loggedAt?: IsoTimestamp;
}

/**
 * Builds a vaping session document ready for Firestore persistence.
 *
 * @param input - Session fields from the Track screen.
 * @returns Normalised session log document.
 */
export function buildVapingSessionLog(input: CreateVapingSessionInput): VapingSessionLog {
  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;
  const id = createTrackingDocumentId();

  return {
    id,
    userId: input.userId,
    puffCount: input.puffCount,
    nicotineMg: null,
    notes: input.notes ?? null,
    loggedAt,
    createdAt: now,
    updatedAt: now,
    isPendingSync: false,
  };
}

/**
 * Builds a craving log document ready for Firestore persistence.
 *
 * @param input - Craving fields from the Track screen.
 * @returns Normalised craving log document.
 */
export function buildCravingLog(input: CreateCravingLogInput): CravingLog {
  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;
  const id = createTrackingDocumentId();

  return {
    id,
    userId: input.userId,
    intensity: input.intensity,
    triggerTags: input.triggerTags,
    notes: input.notes ?? null,
    resisted: input.resisted,
    loggedAt,
    createdAt: now,
    updatedAt: now,
    isPendingSync: false,
  };
}
