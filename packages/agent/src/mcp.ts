/**
 * MCP tool surface for operator machines.
 * Ticks always from suggestBand. explain_proposal may use an LLM for copy only.
 */
import { explainProposal, suggestBand } from "./suggestBand.ts";

export const tools = [
  { name: "list_pairs", description: "List Pairband vaults from deployments.json" },
  { name: "get_pair", description: "Read band, policy, proposal, slot0 for a vault" },
  { name: "suggest_band", description: "PURE tick suggestion. No LLM." },
  { name: "simulate_rebalance", description: "eth_call executeRebalance as curator" },
  { name: "propose_rebalance", description: "Broadcast proposeRebalance from the operator key" },
  { name: "explain_proposal", description: "Human copy for a proposed band. Ticks already chosen." },
] as const;

export function handleTool(name: string, args: Record<string, unknown>): unknown {
  if (name === "suggest_band") {
    return suggestBand({
      tick: Number(args.tick ?? 0),
      spacing: Number(args.spacing ?? 10),
      maxWidth: Number(args.maxWidth ?? 400),
      maxShift: Number(args.maxShift ?? 200),
      currentBand: {
        tickLower: Number(args.curLower ?? -100),
        tickUpper: Number(args.curUpper ?? 100),
      },
    });
  }
  if (name === "explain_proposal") {
    return {
      copy: explainProposal({
        current: { tickLower: Number(args.curLower ?? 0), tickUpper: Number(args.curUpper ?? 0) },
        next: { tickLower: Number(args.nextLower ?? 0), tickUpper: Number(args.nextUpper ?? 0) },
        tick: Number(args.tick ?? 0),
      }),
    };
  }
  return { error: "not implemented in-process — use CLI against a live RPC" };
}
