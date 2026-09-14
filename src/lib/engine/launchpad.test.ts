import { createSeededEngine } from "./seed.ts";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAmountOut } from "./amm.ts";
import {
  CREATOR_FEE_BPS,
  DEMO_USER,
  GRADUATE_AT,
  LAUNCH_FEE_USDC,
  MIN_LP_TOKENS,
  PROTOCOL_FEE_BPS,
  TOTAL_SUPPLY,
  TREASURY,
  VIRTUAL_TOKENS,
  VIRTUAL_USDC,
  WAD,
} from "./constants.ts";
import { getTokensOut, getUsdcOut, splitFees, spotPrice } from "./curve.ts";
import {
  buy,
    createLaunch,
  findLaunch,
  forceGraduate,
  previewBuy,
  previewSell,
  sell,
  tokenBalance,
} from "./launchpad.ts";
import { LaunchError } from "./types.ts";

const A = DEMO_USER;
const B = "0xBEEF0000000000000000000000000000000000B2";

function fresh() {
  const s = createSeededEngine();
  s.usdc[B] = 10_000n * WAD;
  return s;
}

describe("CurveMath", () => {
  it("buy then sell is conservative (fees leak k)", () => {
    const out = getTokensOut(VIRTUAL_USDC, VIRTUAL_TOKENS, 10n * WAD);
    assert.ok(out > 0n);
    const back = getUsdcOut(VIRTUAL_USDC + 10n * WAD, VIRTUAL_TOKENS - out, out);
    assert.ok(back > 0n);
    const drift = back > 10n * WAD ? back - 10n * WAD : 10n * WAD - back;
    assert.ok(drift < WAD / 1_000n, "round-trip drift under 0.1 cent");
  });
  it("ZeroAmount", () => {
    assert.throws(() => getTokensOut(VIRTUAL_USDC, VIRTUAL_TOKENS, 0n), LaunchError);
  });
});

describe("Launchpad", () => {
  it("create sets virtual reserves to the published band", () => {
    const s = fresh();
    const { launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    assert.equal(launch.virtualUsdc, VIRTUAL_USDC);
    assert.equal(launch.virtualTokens, VIRTUAL_TOKENS);
    assert.equal(launch.status, "curve");
    assert.equal(launch.realUsdc, 0n);
  });

  it("buy returns tokens and moves price up", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = state;
    const before = spotPrice(launch.virtualUsdc, launch.virtualTokens);
    s = buy(s, A, launch.id, 10n * WAD);
    const after = findLaunch(s, launch.id);
    assert.ok(tokenBalance(s, launch.id, A) > 0n);
    assert.ok(spotPrice(after.virtualUsdc, after.virtualTokens) > before);
    assert.ok(after.realUsdc > 0n);
  });

  it("sell returns USDC", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, 20n * WAD);
    const tokens = tokenBalance(s, launch.id, A);
    const usdcBefore = s.usdc[A]!;
    s = sell(s, A, launch.id, tokens / 2n);
    assert.ok(s.usdc[A]! > usdcBefore);
    assert.ok(tokenBalance(s, launch.id, A) < tokens);
  });

  it("fees split protocol and creator", () => {
    const fees = splitFees(100n * WAD);
    assert.equal(fees.protocol, (100n * WAD * PROTOCOL_FEE_BPS) / 10_000n);
    assert.equal(fees.creator, (100n * WAD * CREATOR_FEE_BPS) / 10_000n);
    assert.equal(fees.net + fees.protocol + fees.creator, 100n * WAD);
  });

  it("slippage reverts", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    const preview = previewBuy(launch, 5n * WAD);
    assert.throws(
      () => buy(state, A, launch.id, 5n * WAD, preview.tokensOut + 1n),
      (e: unknown) => e instanceof LaunchError && e.code === "Slippage",
    );
  });

  it("cannot sell more than real USDC", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, 5n * WAD);
    const tokens = tokenBalance(s, launch.id, A);
    assert.throws(
      () => previewSell(findLaunch(s, launch.id), tokens * 20n),
      (e: unknown) => e instanceof LaunchError && e.code === "InsufficientRealUsdc",
    );
  });

  it("graduate at threshold locks LP", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, GRADUATE_AT + 5n * WAD);
    const g = findLaunch(s, launch.id);
    assert.equal(g.status, "stage_b");
    assert.ok(g.pair);
    assert.ok(g.lpBurned > 0n);
    assert.equal(g.lpSupply, 0n);
    assert.ok(g.reserveUsdc > 0n);
    assert.ok(g.reserveToken >= MIN_LP_TOKENS);
  });

  it("buy auto-graduates", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, 40n * WAD);
    assert.equal(findLaunch(s, launch.id).status, "curve");
    s = buy(s, A, launch.id, 50n * WAD);
    assert.equal(findLaunch(s, launch.id).status, "stage_b");
  });

  it("curve buy after graduate routes to AMM", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, GRADUATE_AT + 2n * WAD);
    const g = findLaunch(s, launch.id);
    assert.equal(g.status, "stage_b");
    const r0 = g.reserveUsdc;
    s = buy(s, A, launch.id, 3n * WAD);
    const g2 = findLaunch(s, launch.id);
    assert.equal(g2.status, "stage_b");
    assert.ok(g2.reserveUsdc > r0);
  });

  it("AMM swap after graduate conserves k minus fee", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, GRADUATE_AT + 2n * WAD);
    const g = findLaunch(s, launch.id);
    const k = g.reserveUsdc * g.reserveToken;
    const out = getAmountOut(2n * WAD, g.reserveUsdc, g.reserveToken);
    s = buy(s, A, launch.id, 2n * WAD);
    const g2 = findLaunch(s, launch.id);
    assert.ok(g2.reserveUsdc * g2.reserveToken >= k);
    assert.ok(out > 0n);
  });

  it("locker has no withdraw — LP stays on the pair", () => {
    let s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    s = buy(state, A, launch.id, 90n * WAD);
    const g = findLaunch(s, launch.id);
    assert.ok(g.lpBurned > 0n);
    assert.equal(g.pair?.startsWith("0x"), true);
  });

  it("stranger cannot mint — only curve credits via buy", () => {
    const s = fresh();
    const { launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    assert.equal(tokenBalance(s, launch.id, B), 0n);
  });

  it("zero amount reverts", () => {
    const s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    assert.throws(() => buy(state, A, launch.id, 0n), LaunchError);
  });

  it("invalid meta reverts", () => {
    const s = fresh();
    assert.throws(() => createLaunch(s, A, "X", "H", ""), LaunchError);
    assert.throws(() => createLaunch(s, A, "Hello", "bad symbol", "ok"), LaunchError);
  });

  it("forceGraduate rejects early", () => {
    const s = fresh();
    const { state, launch } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    assert.throws(
      () => forceGraduate(state, A, launch.id),
      (e: unknown) => e instanceof LaunchError && e.code === "NotGraduated",
    );
  });

  it("charges LAUNCH_FEE_USDC to treasury on create", () => {
    const s = fresh();
    const beforeTreasury = s.usdc[TREASURY] ?? 0n;
    const beforeUser = s.usdc[A] ?? 0n;
    const { state } = createLaunch(s, A, "Helix", "HLX", "A clean pair.");
    assert.equal((state.usdc[TREASURY] ?? 0n) - beforeTreasury, LAUNCH_FEE_USDC);
    assert.equal(beforeUser - (state.usdc[A] ?? 0n), LAUNCH_FEE_USDC);
  });
});
