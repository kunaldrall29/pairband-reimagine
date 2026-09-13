import { align, shift } from "./bandMath.ts";

export type SuggestBandInput = {
  tick: number;
  spacing: number;
  maxWidth: number;
  maxShift: number;
  currentBand: { tickLower: number; tickUpper: number };
  /** Width used for the suggestion. Defaults to min(maxWidth, 200) aligned. */
  width?: number;
};

/**
 * PURE deterministic band suggestion. NEVER let an LLM choose ticks.
 *
 * lower = floor((tick - width/2) / spacing) * spacing
 * upper = lower + width
 * clip to maxShift vs current band (keep width, slide center).
 */
export function suggestBand(input: SuggestBandInput): { tickLower: number; tickUpper: number } {
  const { tick, spacing, maxWidth, maxShift, currentBand } = input;
  let w = input.width ?? Math.min(maxWidth, 200);
  w = Math.max(spacing, align(w, spacing));
  if (w > maxWidth) w = align(maxWidth, spacing);
  if (w < spacing) w = spacing;

  let lower = align(tick - Math.floor(w / 2), spacing);
  let upper = lower + w;

  let s = shift(currentBand.tickLower, currentBand.tickUpper, lower, upper);
  if (s <= maxShift) return { tickLower: lower, tickUpper: upper };

  // Keep width, move the center toward the current band until L1 ≤ maxShift.
  const curMid = (currentBand.tickLower + currentBand.tickUpper) / 2;
  const newMid = (lower + upper) / 2;
  const midDelta = newMid - curMid;
  // L1 for a pure translation of D ticks on both edges is 2|D|.
  const maxTranslate = Math.floor(maxShift / 2);
  const clipped = Math.sign(midDelta) * Math.min(Math.abs(midDelta), maxTranslate);
  lower = align(currentBand.tickLower + clipped, spacing);
  upper = lower + (currentBand.tickUpper - currentBand.tickLower);
  // If current width != suggested width, still clip L1:
  if (shift(currentBand.tickLower, currentBand.tickUpper, lower, upper) > maxShift) {
    return { tickLower: currentBand.tickLower, tickUpper: currentBand.tickUpper };
  }
  return { tickLower: lower, tickUpper: upper };
}

export function explainProposal(args: {
  current: { tickLower: number; tickUpper: number };
  next: { tickLower: number; tickUpper: number };
  tick: number;
}): string {
  const dir =
    (args.next.tickLower + args.next.tickUpper) / 2 >
    (args.current.tickLower + args.current.tickUpper) / 2
      ? "up"
      : "down";
  const s = Math.abs(args.next.tickLower - args.current.tickLower)
    + Math.abs(args.next.tickUpper - args.current.tickUpper);
  return `Price is at tick ${args.tick}. The suggested band slides ${dir} by L1 ${s} ticks so the live range stays centered on spot, within policy.maxShift. Agent proposes; curator still has to execute.`;
}
