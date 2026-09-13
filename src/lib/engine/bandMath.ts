/** Tick alignment, width, L1 shift, in-range. Mirrors BandMath.sol. */

export class BandError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "BandError";
  }
}

export function align(tick: number, spacing: number): number {
  if (spacing <= 0) throw new BandError("InvalidTicks", "spacing must be > 0");
  let compressed = Math.trunc(tick / spacing);
  if (tick < 0 && tick % spacing !== 0) compressed -= 1;
  return compressed * spacing;
}

export function width(tickLower: number, tickUpper: number): number {
  if (tickLower >= tickUpper) throw new BandError("InvalidTicks", "inverted band");
  return tickUpper - tickLower;
}

/** L1 shift: |Δlower| + |Δupper|. Documented in BandMath.sol NatSpec. */
export function shift(
  curLower: number,
  curUpper: number,
  newLower: number,
  newUpper: number,
): number {
  return Math.abs(newLower - curLower) + Math.abs(newUpper - curUpper);
}

export function inRange(tick: number, tickLower: number, tickUpper: number): boolean {
  return tick >= tickLower && tick < tickUpper;
}

export function validateBand(
  tickLower: number,
  tickUpper: number,
  spacing: number,
  maxWidth: number,
): void {
  if (spacing <= 0) throw new BandError("InvalidTicks", "spacing");
  if (tickLower >= tickUpper) throw new BandError("InvalidTicks", "inverted");
  if (tickLower % spacing !== 0 || tickUpper % spacing !== 0) {
    throw new BandError("InvalidTicks", "unaligned");
  }
  const w = tickUpper - tickLower;
  if (w > maxWidth) throw new BandError("TooWide", `width ${w} > maxWidth ${maxWidth}`);
  if (w % spacing !== 0) throw new BandError("InvalidTicks", "width not multiple of spacing");
}
