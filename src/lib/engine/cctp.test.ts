import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ARC_CCTP_DOMAIN } from "./cctp.ts";
import { DEMO_USER, WAD } from "./constants.ts";
import { buy, createEngine, sourceBalance, usdcBalance, bridgeOut } from "./launchpad.ts";

describe("CCTP settle on Arc", () => {
  it("buy from Base burns remote USDC and settles on Arc", () => {
    const s = createEngine({ seed: true });
    const paper = s.launches.find((l) => l.symbol === "PAPER")!;
    const user = DEMO_USER;
    const baseBefore = sourceBalance(s, user, 6);
    const arcBefore = usdcBalance(s, user);
    assert.ok(baseBefore >= 10n * WAD);
    const next = buy(s, user, paper.id, 10n * WAD, 0n, 6);
    assert.equal(sourceBalance(next, user, 6), baseBefore - 10n * WAD);
    assert.equal(usdcBalance(next, user), arcBefore);
    const t = next.trades[0]!;
    assert.equal(t.sourceDomain, 6);
    assert.equal(t.destDomain, ARC_CCTP_DOMAIN);
    assert.ok(t.tokens > 0n);
  });

  it("unknown domain reverts", () => {
    const s = createEngine({ seed: true });
    const paper = s.launches.find((l) => l.symbol === "PAPER")!;
    const user = DEMO_USER;
    assert.throws(() => buy(s, user, paper.id, WAD, 0n, 99), (e: { code: string }) => e.code === "UnknownDomain");
  });

  it("bridgeOut credits destination, debit Arc", () => {
    const s = createEngine({ seed: true });
    const user = DEMO_USER;
    const arcBefore = usdcBalance(s, user);
    const ethBefore = sourceBalance(s, user, 0);
    const next = bridgeOut(s, user, 0, 100n * WAD);
    assert.equal(usdcBalance(next, user), arcBefore - 100n * WAD);
    assert.equal(sourceBalance(next, user, 0), ethBefore + 100n * WAD);
    assert.equal(next.trades[0]!.side, "bridge");
  });

  it("Arc-native buy does not touch remotes", () => {
    const s = createEngine({ seed: true });
    const paper = s.launches.find((l) => l.symbol === "PAPER")!;
    const user = DEMO_USER;
    const baseBefore = sourceBalance(s, user, 6);
    const next = buy(s, user, paper.id, 5n * WAD, 0n, 26);
    assert.equal(sourceBalance(next, user, 6), baseBefore);
  });
});
