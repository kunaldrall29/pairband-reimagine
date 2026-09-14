import { WAD } from "@/lib/engine/constants.ts";
import { formatUnits } from "@/lib/utils";

export function formatUsdc(amount: bigint, digits = 2): string {
  return `$${formatUnits(amount, 18, digits)}`;
}

export function formatToken(amount: bigint, digits = 2): string {
  return formatUnits(amount, 18, digits);
}

export function formatPriceWad(price: bigint): string {
  const n = Number(price) / Number(WAD);
  if (!Number.isFinite(n) || n <= 0) return "$0.00";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.01) return `$${n.toFixed(6)}`;
  if (n >= 0.0001) return `$${n.toFixed(8)}`;
  return `$${n.toExponential(2)}`;
}

export function formatCompact(amount: bigint): string {
  const n = Number(amount) / Number(WAD);
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  if (abs >= 1) return `${sign}$${abs.toFixed(2)}`;
  if (abs >= 0.01) return `${sign}$${abs.toFixed(4)}`;
  return `${sign}$${abs.toFixed(6)}`;
}

export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function toInput(amount: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);
  const whole = amount / base;
  const frac = (amount % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : `${whole}`;
}

export function impactLabel(bps: number): string {
  if (bps < 5) return `${(bps / 100).toFixed(2)}%`;
  if (bps < 100) return `${(bps / 100).toFixed(2)}%`;
  return `${(bps / 100).toFixed(1)}%`;
}

export function errorCopy(code: string | null): string {
  switch (code) {
    case "ZeroAmount":
      return "Enter an amount.";
    case "Slippage":
      return "Price moved. Tighten size or retry.";
    case "BelowMinLp":
      return "That buy would drain the Uniswap reserve.";
    case "InsufficientRealUsdc":
      return "Not enough USDC in the curve.";
    case "InsufficientBalance":
      return "Not enough USDC on Arc (launch fee, buy, or agent fee).";
    case "AlreadyGraduated":
      return "Already on Uniswap.";
    case "NotGraduated":
      return "Curve has not filled yet.";
    case "UnknownLaunch":
      return "Token not found.";
    case "InvalidMeta":
      return "Name 2–32 chars. Symbol 2–12 A–Z / 0–9.";
    case "InsufficientLiquidity":
      return "Not enough liquidity.";
    case "FaucetCapped":
      return "Faucet cap reached.";
    case "NotOwner":
      return "Not your order.";
    case "OrderNotFound":
      return "Order already filled or cancelled.";
    case "UnknownDomain":
      return "That chain is not a CCTP domain we settle.";
    case "SameDomain":
      return "Already on Arc. Pick a destination chain.";
    default:
      return code ?? "";
  }
}
