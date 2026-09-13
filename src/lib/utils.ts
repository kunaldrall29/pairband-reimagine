import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddr(addr: string, size = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

export function formatUnits(amount: bigint, decimals: number, digits = 2): string {
  const neg = amount < 0n;
  const v = neg ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const whole = v / base;
  const frac = v % base;
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, digits);
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (digits === 0 || decimals === 0) return `${neg ? "−" : ""}${wholeStr}`;
  return `${neg ? "−" : ""}${wholeStr}.${fracStr}`;
}

export function parseUnits(value: string, decimals: number): bigint {
  const trimmed = value.trim();
  if (!trimmed) return 0n;
  const [w, f = ""] = trimmed.replace(/,/g, "").split(".");
  const frac = (f + "0".repeat(decimals)).slice(0, decimals);
  const sign = w.startsWith("-") ? -1n : 1n;
  const whole = BigInt(w.replace("-", "") || "0");
  return sign * (whole * 10n ** BigInt(decimals) + BigInt(frac || "0"));
}

export function formatUsd(amount: bigint, decimals = 6): string {
  return `$${formatUnits(amount, decimals, 2)}`;
}

export function formatTick(tick: number): string {
  return tick > 0 ? `+${tick}` : String(tick);
}

export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

export function formatPrice(tick: number, digits = 6): string {
  return tickToPrice(tick).toFixed(digits);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
