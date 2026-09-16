/** Supportive tips shown on the reframing screen after a slip-up. */
export const REFRAME_TIPS = [
  'Cravings usually peak within a few minutes. A short walk or glass of water can help them pass.',
  'Notice what you were feeling before the puff. Naming the trigger gives you power over the next one.',
  'Progress is not erased by one puff. Your streak of effort still counts.',
  'Try box breathing: inhale for four counts, hold for four, exhale for four, hold for four.',
  'Reach out in Support chat if you want encouragement right now. You do not have to do this alone.',
] as const;

/**
 * Returns a random supportive tip for the reframing flow.
 *
 * @param index - Optional fixed index for deterministic tests.
 * @returns Tip copy.
 */
export function pickReframeTip(index?: number): string {
  if (index !== undefined) {
    return REFRAME_TIPS[index % REFRAME_TIPS.length] ?? REFRAME_TIPS[0];
  }

  const randomIndex = Math.floor(Math.random() * REFRAME_TIPS.length);
  return REFRAME_TIPS[randomIndex] ?? REFRAME_TIPS[0];
}
