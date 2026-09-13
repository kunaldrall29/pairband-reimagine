#!/usr/bin/env node
/**
 * pnpm pairband propose --vault 0x --rpc URL --key ENV
 * Ticks ALWAYS come from suggestBand. The key is operator-local — never in the browser.
 */
import { suggestBand } from "./suggestBand.ts";

function arg(name: string, fallback = ""): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? (process.argv[i + 1] ?? fallback) : fallback;
}

const cmd = process.argv[2] ?? "help";

if (cmd === "propose" || cmd === "suggest") {
  const tick = Number(arg("tick", "0"));
  const spacing = Number(arg("spacing", "10"));
  const maxWidth = Number(arg("maxWidth", "400"));
  const maxShift = Number(arg("maxShift", "200"));
  const curL = Number(arg("curLower", "-100"));
  const curU = Number(arg("curUpper", "100"));
  const band = suggestBand({
    tick,
    spacing,
    maxWidth,
    maxShift,
    currentBand: { tickLower: curL, tickUpper: curU },
  });
  process.stdout.write(JSON.stringify({ ok: true, band, vault: arg("vault") }, null, 2) + "\n");
  if (cmd === "propose") {
    process.stderr.write(
      "Dry-run: broadcast PairbandVault.proposeRebalance from the operator key in $PAIRBAND_KEY. executeRebalance is curator-only.\n",
    );
  }
} else {
  process.stdout.write(`pairband — agent CLI
  suggest --tick N --spacing 10 --maxWidth 400 --maxShift 200 --curLower -100 --curUpper 100
  propose --vault 0x --rpc URL --tick N   (ticks from suggestBand, key from $PAIRBAND_KEY)

MCP tools: list_pairs, get_pair, suggest_band, simulate_rebalance, propose_rebalance, explain_proposal
`);
}
