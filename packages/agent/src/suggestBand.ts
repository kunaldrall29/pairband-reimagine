/**
 * PURE deterministic band suggestion. Never let an LLM choose ticks.
 * lower = floor((tick - width/2) / spacing) * spacing
 * upper = lower + width
 * clip to maxShift vs current band
 */

export function align(tick: number, spacing: number): number {
  let compressed = Math.trunc(tick / spacing);
  if (tick < 0 && tick % spacing !== 0) compressed -= 1;
  return compressed * spacing;
}

export function shift(curL: number, curU: number, nL: number, nU: number): number {
  return Math.abs(nL - curL) + Math.abs(nU - curU);
}

export function suggestBand(input: {
  tick: number;
  spacing: number;
  maxWidth: number;
  maxShift: number;
  currentBand: { tickLower: number; tickUpper: number };
  width?: number;
}): { tickLower: number; tickUpper: number } {
  const { tick, spacing, maxWidth, maxShift, currentBand } = input;
  let w = input.width ?? Math.min(maxWidth, 200);
  w = Math.max(spacing, align(w, spacing));
  if (w > maxWidth) w = align(maxWidth, spacing);

  let lower = align(tick - Math.floor(w / 2), spacing);
  let upper = lower + w;
  if (shift(currentBand.tickLower, currentBand.tickUpper, lower, upper) <= maxShift) {
    return { tickLower: lower, tickUpper: upper };
  }
  const curMid = (currentBand.tickLower + currentBand.tickUpper) / 2;
  const newMid = (lower + upper) / 2;
  const midDelta = newMid - curMid;
  const maxTranslate = Math.floor(maxShift / 2);
  const clipped = Math.sign(midDelta) * Math.min(Math.abs(midDelta), maxTranslate);
  lower = align(currentBand.tickLower + clipped, spacing);
  upper = lower + (currentBand.tickUpper - currentBand.tickLower);
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
  const s =
    Math.abs(args.next.tickLower - args.current.tickLower) +
    Math.abs(args.next.tickUpper - args.current.tickUpper);
  return `Price is at tick ${args.tick}. Suggested band slides ${dir} by L1 ${s} ticks, clipped to maxShift. Agent proposes; curator executes.`;
}
