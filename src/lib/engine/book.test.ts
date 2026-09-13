import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WAD } from "./constants.ts";
import { emptyBook, insertOrder, matchAsks, matchBids, cancelOrder } from "./book.ts";
import { LaunchError, type RestingOrder } from "./types.ts";

function ask(id: number, price: bigint, tok: bigint): RestingOrder {
  return {
    id,
    launchId: "x",
    owner: "0xMAKER",
    side: "ask",
    price,
    remaining: tok,
    escrow: tok,
    createdAt: 1,
  };
}

function bid(id: number, price: bigint, tok: bigint): RestingOrder {
  return {
    id,
    launchId: "x",
    owner: "0xMAKER",
    side: "bid",
    price,
    remaining: tok,
    escrow: (tok * price) / WAD,
    createdAt: 1,
  };
}

describe("on-chain book twin", () => {
  it("fills asks price-time (lowest first)", () => {
    const book = emptyBook();
    insertOrder(book, ask(1, 2n * WAD, 10n * WAD));
    insertOrder(book, ask(2, 1n * WAD, 10n * WAD));
    const m = matchAsks(book, 5n * WAD);
    assert.equal(m.fills.length, 1);
    assert.equal(m.fills[0]!.orderId, 2);
    assert.equal(m.tokensOut, 5n * WAD);
    assert.equal(book.asks[0]!.id, 2);
    assert.equal(book.asks[0]!.remaining, 5n * WAD);
  });

  it("walks multiple levels", () => {
    const book = emptyBook();
    insertOrder(book, ask(1, WAD, 3n * WAD));
    insertOrder(book, ask(2, 2n * WAD, 10n * WAD));
    const m = matchAsks(book, 5n * WAD);
    assert.equal(m.fills.length, 2);
    assert.equal(m.tokensOut, 4n * WAD); // 3 at 1 + 1 at 2
    assert.equal(m.leftoverUsdc, 0n);
  });

  it("limit price stops the walk", () => {
    const book = emptyBook();
    insertOrder(book, ask(1, WAD, 10n * WAD));
    insertOrder(book, ask(2, 3n * WAD, 10n * WAD));
    const m = matchAsks(book, 100n * WAD, WAD);
    assert.equal(m.fills.length, 1);
    assert.ok(m.leftoverUsdc > 0n);
  });

  it("bids fill highest first", () => {
    const book = emptyBook();
    insertOrder(book, bid(1, WAD, 5n * WAD));
    insertOrder(book, bid(2, 2n * WAD, 5n * WAD));
    const m = matchBids(book, 3n * WAD);
    assert.equal(m.fills[0]!.orderId, 2);
    assert.equal(m.usdcOut, 6n * WAD);
  });

  it("cancel returns only the owner", () => {
    const book = emptyBook();
    insertOrder(book, ask(1, WAD, 1n * WAD));
    assert.throws(() => cancelOrder(book, 1, "0xOTHER"), (e: LaunchError) => e.code === "NotOwner");
    const o = cancelOrder(book, 1, "0xMAKER");
    assert.equal(o.remaining, 1n * WAD);
    assert.equal(book.asks.length, 0);
  });
});
