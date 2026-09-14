"use client";

import { useMemo, useState } from "react";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { OrderBook } from "@/components/app/order-book";
import { SourcePicker } from "@/components/app/source-picker";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { DEFAULT_SLIPPAGE_BPS, WAD } from "@/lib/engine/constants.ts";
import { ARC_CCTP_DOMAIN, chainByDomain, isArc } from "@/lib/engine/cctp.ts";
import { bookMid } from "@/lib/engine/book.ts";
import { hasBook, isStageB } from "@/lib/engine/status.ts";
import {
  minOut,
  openOrders,
  previewBuy,
  previewSell,
  sourceBalance,
  tokenBalance,
} from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { LaunchError, type Launch } from "@/lib/engine/types.ts";
import { errorCopy, formatPriceWad, formatToken, formatUsdc, impactLabel, toInput } from "@/lib/format.ts";
import { parseUnits } from "@/lib/utils";
import { useLiveTrade } from "@/lib/live-trade";
import { fetchOnchainLaunches } from "@/lib/onchain-launches.ts";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi.ts";
import { arcTestnet } from "@/lib/chains";
import { createPublicClient, http } from "viem";
import { toast } from "sonner";

export function TradeTicket({ launch }: { launch: Launch }) {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const account = useLaunchpad((s) => s.account);
  const lastError = useLaunchpad((s) => s.lastError);
  const doBuy = useLaunchpad((s) => s.buy);
  const doSell = useLaunchpad((s) => s.sell);
  const doLimitBuy = useLaunchpad((s) => s.limitBuy);
  const doLimitSell = useLaunchpad((s) => s.limitSell);
  const doCancel = useLaunchpad((s) => s.cancel);
  const sourceDomain = useLaunchpad((s) => s.sourceDomain);
  const { live: walletLive, busy, approveAndBuy, approveAndSell } = useLiveTrade();
  const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);
  const [preferLive, setPreferLive] = useState(true);
  void version;

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [mode, setMode] = useState<"market" | "limit">("market");
  const [raw, setRaw] = useState("10");
  const [rawPrice, setRawPrice] = useState("");
  const [slip, setSlip] = useState(Number(DEFAULT_SLIPPAGE_BPS));

  const pay = side === "buy" ? sourceBalance(engine, account, sourceDomain) : tokenBalance(engine, launch.id, account);
  const tokens = tokenBalance(engine, launch.id, account);
  const live = engine.launches.find((l) => l.id === launch.id) ?? launch;
  const book = engine.books[live.id];
  const mine = openOrders(engine, live.id, account);
  const graduated = isStageB(live);
  const bookOpen = hasBook(live);

  const parsed = useMemo(() => {
    try {
      return parseUnits(raw || "0", 18);
    } catch {
      return 0n;
    }
  }, [raw]);

  const limitPx = useMemo(() => {
    if (!rawPrice) return bookMid(book) ?? 0n;
    try {
      return parseUnits(rawPrice, 18);
    } catch {
      return 0n;
    }
  }, [rawPrice, book, version]);

  const quote = useMemo(() => {
    try {
      if (parsed <= 0n || mode === "limit") return null;
      if (side === "buy") return previewBuy(live, parsed, book);
      return previewSell(live, parsed, book);
    } catch (e) {
      return e instanceof LaunchError ? { error: e.code } : { error: "InsufficientLiquidity" };
    }
  }, [live, parsed, side, mode, book, version]);

  async function refreshOnchain() {
    try {
      const client = createPublicClient({
        chain: arcTestnet,
        transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io"),
      });
      const rows = await fetchOnchainLaunches(client);
      upsertOnchainLaunches(rows.map((r) => r.launch));
    } catch {
      /* Discover sync will catch up */
    }
  }

  async function submit() {
    if (parsed <= 0n) return;
    const onChainIdOk = /^\d+$/.test(live.id);
    // Launchpad buy/sell route to the curve before graduation and to the on-chain book after.
    const useChainBuy =
      preferLive && walletLive && side === "buy" && mode === "market" && onChainIdOk;
    const useChainSell =
      preferLive && walletLive && side === "sell" && mode === "market" && onChainIdOk;
    if (useChainBuy && quote && "tokensOut" in quote) {
      try {
        const onChainId = Number(live.id);
        await approveAndBuy(onChainId, parsed, minOut(quote.tokensOut, BigInt(slip)));
        setRaw("");
        void refreshOnchain();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Transaction failed");
      }
      return;
    }
    if (useChainSell && quote && "usdcOut" in quote) {
      try {
        const onChainId = Number(live.id);
        await approveAndSell(onChainId, parsed, minOut(quote.usdcOut, BigInt(slip)));
        setRaw("");
        void refreshOnchain();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Transaction failed");
      }
      return;
    }
    let ok = false;
    if (mode === "limit") {
      if (limitPx <= 0n) return;
      ok = side === "buy" ? doLimitBuy(live.id, limitPx, parsed) : doLimitSell(live.id, limitPx, parsed);
    } else {
      if (!quote || "error" in quote) return;
      const bps = BigInt(slip);
      ok =
        side === "buy" && "tokensOut" in quote
          ? doBuy(live.id, parsed, minOut(quote.tokensOut, bps))
          : "usdcOut" in quote
            ? doSell(live.id, parsed, minOut(quote.usdcOut, bps))
            : false;
    }
    if (ok) setRaw("");
  }

  const venue = !bookOpen
    ? "Bonding curve · 1.5%"
    : mode === "limit"
      ? "On-chain book · rest"
      : graduated
        ? "Book, then Uniswap"
        : "Book, then curve";

  const impact = quote && "impactBps" in quote ? quote.impactBps : 0;

  return (
    <GlassPanel className="p-5">
      {bookOpen ? (
        <div className="mb-4">
          <OrderBook book={book} symbol={live.symbol} onPrice={(p) => setRawPrice(toInput(p))} />
        </div>
      ) : null}

      <div className="mb-3 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`min-h-10 flex-1 rounded-xl text-sm font-medium capitalize ${
              side === s ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {bookOpen ? (
        <div className="mb-3 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10">
          {(["market", "limit"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`min-h-10 flex-1 rounded-xl text-sm capitalize ${
                mode === m ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted uppercase">
        <UsdcMark size={12} /> {venue}
      </p>
      {side === "buy" ? <SourcePicker className="mb-3" /> : (
        <p className="mb-2 inline-flex items-center gap-1 font-mono text-[10px] text-muted">
          <ArcMark size={11} /> Sell settles on Arc. USDC out stays until you bridge.
        </p>
      )}
      {mode === "limit" && bookOpen ? (
        <label className="mb-2 block">
          <span className="mb-1 block text-[11px] text-muted">Limit price</span>
          <input
            value={rawPrice}
            onChange={(e) => setRawPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder={formatPriceWad(limitPx || 0n).replace("$", "")}
            className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-lg tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink"
          />
        </label>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
      <label className="relative block">
        <span className="sr-only">Amount</span>
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {side === "buy" ? <UsdcMark size={20} /> : null}
        </span>
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="decimal"
          placeholder="0.00"
          className={`h-14 w-full rounded-2xl border border-ink/10 bg-paper font-mono text-2xl tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink ${side === "buy" ? "px-12" : "px-4"}`}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-muted">
          {side === "buy" ? "USDC" : live.symbol}
        </span>
      </label>
      <div className="mt-2 flex flex-wrap gap-1">
        {(side === "buy" ? (["10", "50", "100", "500"] as const) : (["25", "50", "75", "100"] as const)).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              if (side === "buy") setRaw(chip);
              else setRaw(toInput((pay * BigInt(chip)) / 100n));
            }}
            className="min-h-8 rounded-full bg-ink/5 px-2.5 font-mono text-[11px] text-muted hover:bg-ink/10 dark:bg-paper/10"
          >
            {side === "buy" ? `$${chip}` : `${chip}%`}
          </button>
        ))}
        <button
          type="button"
          className="min-h-8 rounded-full bg-ink/5 px-2.5 font-mono text-[11px] font-medium text-teal-2 hover:bg-ink/10 dark:bg-paper/10"
          onClick={() => setRaw(toInput(pay))}
        >
          Max
        </button>
      </div>
      <div className="mt-2 text-xs text-muted">
        {side === "buy"
          ? `Balance ${formatUsdc(pay)} on ${chainByDomain(sourceDomain)?.name ?? "Arc"}`
          : `Balance ${formatToken(tokens)} ${live.symbol}`}
      </div>
      <div className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 font-mono text-sm dark:bg-paper/5">
        {mode === "limit" ? (
          <p className="text-muted">
            Rests on the book at {formatPriceWad(limitPx)}. Crossed size fills immediately. Remainder escrowed on-chain.
          </p>
        ) : quote && "error" in quote ? (
          <p className="text-danger">{errorCopy(quote.error)}</p>
        ) : quote && "tokensOut" in quote ? (
          <div>
            <p>
              You receive <span className="tabular">{formatToken(quote.tokensOut)}</span> {live.symbol}
            </p>
            <p className={`mt-1 text-xs ${impact >= 80 ? "text-danger" : "text-muted"}`}>
              Impact {impactLabel(quote.impactBps)}
              {quote.bookUsdc && quote.bookUsdc > 0n ? ` · book ${formatUsdc(quote.bookUsdc)}` : ""}
              {quote.ammUsdc && quote.ammUsdc > 0n ? ` · Uniswap ${formatUsdc(quote.ammUsdc)}` : ""}
            </p>
          </div>
        ) : quote && "usdcOut" in quote ? (
          <div>
            <p>
              You receive <span className="tabular">{formatUsdc(quote.usdcOut)}</span>
            </p>
            <p className={`mt-1 text-xs ${impact >= 80 ? "text-danger" : "text-muted"}`}>
              Impact {impactLabel(quote.impactBps)}
            </p>
          </div>
        ) : (
          <p className="text-muted">Enter an amount to preview.</p>
        )}
      </div>
      {mode === "market" ? (
        <label className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Slippage {slip / 100}%</span>
          <input
            type="range"
            min={10}
            max={300}
            step={10}
            value={slip}
            onChange={(e) => setSlip(Number(e.target.value))}
            className="w-28"
          />
        </label>
      ) : null}
      {lastError ? <p className="mt-2 text-sm text-danger">{errorCopy(lastError)}</p> : null}
      <ClayButton className="mt-4 w-full" type="submit" disabled={parsed <= 0n || busy}>
        {busy
          ? "Confirm in wallet…"
          : preferLive && walletLive && mode === "market" && /^\d+$/.test(live.id)
            ? `${side === "buy" ? "Buy" : "Sell"} on Arc · ${live.symbol}`
            : mode === "limit"
              ? `Post ${side}`
              : side === "buy"
                ? `Buy ${live.symbol}`
                : `Sell ${live.symbol}`}
        {!busy && bookOpen && mode === "market" ? (graduated ? " · book+AMM" : " · book+curve") : ""}
      </ClayButton>
      {walletLive ? (
        <label className="mt-3 flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={preferLive}
            onChange={(e) => setPreferLive(e.target.checked)}
            className="size-4 rounded border-ink/20"
          />
          Broadcast market orders to the Arc launchpad (curve before graduation, book after)
        </label>
      ) : (
        <p className="mt-3 text-xs text-muted">Connect a wallet to broadcast. Until then fills use this preview book.</p>
      )}
      </form>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {live.status === "curve"
          ? "1.0% protocol + 0.5% creator in USDC. At $80 the pair mints, LP burns, and an on-chain book opens."
          : "Market walks the on-chain book (price-time), then Uniswap 0.30%. Limits rest; cancel returns escrow. LP cannot be pulled."}{" "}
        {side === "buy" && !isArc(sourceDomain)
          ? `This fill burns USDC on ${chainByDomain(sourceDomain)?.name} (CCTP ${sourceDomain}) and settles on Arc domain ${ARC_CCTP_DOMAIN}.`
          : "Tokens never leave Arc."}
      </p>
      {mine.length > 0 ? (
        <div className="mt-4 border-t border-ink/8 pt-3 dark:border-paper/10">
          <p className="mb-2 font-mono text-[11px] text-muted uppercase">Your orders</p>
          <ul className="space-y-1">
            {mine.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono">
                  {o.side} {formatPriceWad(o.price)} · {formatToken(o.remaining, 0)}
                </span>
                <button type="button" className="text-danger" onClick={() => doCancel(live.id, o.id)}>
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="sr-only">{WAD.toString()}</p>
    </GlassPanel>
  );
}
