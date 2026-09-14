import { create } from "zustand";
import {
  createDemoState,
  deposit,
  executeRebalance,
  proposeRebalance,
  rejectProposal,
  withdraw,
  type EngineState,
} from "@/lib/engine/vault";
import { getSqrtRatioAtTick } from "@/lib/engine/tickMath";
import { explainProposal, suggestBand } from "@/lib/engine/suggestBand";
import {
  DEMO_AGENT,
  DEMO_CURATOR,
  DEMO_USER,
  VaultError,
  ZERO,
} from "@/lib/engine/vaultTypes";
import { AGENT_FEE_VAULT_USDC } from "@/lib/engine/constants";

export const VAULT_DEMO_ID = "pb-usdc-usd1";
export const AGENT_FEE_USDC_LABEL = "$0.25";

export type VaultRole = "agent" | "curator" | "user";

function accountFor(role: VaultRole): string {
  if (role === "agent") return DEMO_AGENT;
  if (role === "curator") return DEMO_CURATOR;
  return DEMO_USER;
}

function liveDemoState(): EngineState {
  const state = createDemoState();
  state.chainId = 5042002;
  state.chainName = "Arc Testnet";
  state.policy = {
    ...state.policy,
    agent: DEMO_AGENT,
    proposalDelay: 3,
  };
  // Offset spot so the suggested band slides vs the seeded [-100,100) range.
  state.tick = 40;
  state.sqrtPriceX96 = getSqrtRatioAtTick(40);
  const agentBal = state.wallets.get(DEMO_AGENT) ?? { t0: 0n, t1: 0n };
  state.wallets.set(DEMO_AGENT, {
    t0: agentBal.t0 + 1_000n * 1_000_000n,
    t1: agentBal.t1 + 1_000n * 1_000_000n,
  });
  void ZERO;
  void AGENT_FEE_VAULT_USDC;
  return state;
}

export function suggestedBandLabel(engine: EngineState): string {
  const next = suggestBand({
    tick: engine.tick,
    spacing: engine.tickSpacing,
    maxWidth: engine.policy.maxWidth,
    maxShift: engine.policy.maxShift,
    currentBand: engine.band,
  });
  return explainProposal({
    current: engine.band,
    next,
    tick: engine.tick,
  });
}

type VaultStore = {
  engine: EngineState;
  version: number;
  role: VaultRole;
  account: string;
  lastError: string | null;
  lastHash: string | null;
  setRole: (role: VaultRole) => void;
  clearError: () => void;
  deposit: (amount0Human: string, amount1Human: string) => void;
  withdraw: (sharesHuman: string) => void;
  proposeSuggested: () => void;
  reject: () => void;
  execute: () => void;
  reset: () => void;
};

function parse6(human: string): bigint {
  const n = Number(human);
  if (!Number.isFinite(n) || n <= 0) return 0n;
  return BigInt(Math.round(n * 1e6));
}

export const useVault = create<VaultStore>((set, get) => ({
  engine: liveDemoState(),
  version: 0,
  role: "agent",
  account: DEMO_AGENT,
  lastError: null,
  lastHash: null,

  setRole: (role) => set({ role, account: accountFor(role), lastError: null }),

  clearError: () => set({ lastError: null }),

  deposit: (amount0Human, amount1Human) => {
    try {
      const { engine, account, version } = get();
      const result = deposit(engine, account, parse6(amount0Human), parse6(amount1Human));
      set({ engine, version: version + 1, lastError: null, lastHash: result.hash });
    } catch (e) {
      set({ lastError: e instanceof VaultError ? e.message : "Deposit failed", lastHash: null });
    }
  },

  withdraw: (sharesHuman) => {
    try {
      const { engine, account, version } = get();
      const result = withdraw(engine, account, BigInt(sharesHuman || "0"));
      set({ engine, version: version + 1, lastError: null, lastHash: result.hash });
    } catch (e) {
      set({ lastError: e instanceof VaultError ? e.message : "Withdraw failed", lastHash: null });
    }
  },

  proposeSuggested: () => {
    try {
      const { engine, account, version } = get();
      const next = suggestBand({
        tick: engine.tick,
        spacing: engine.tickSpacing,
        maxWidth: engine.policy.maxWidth,
        maxShift: engine.policy.maxShift,
        currentBand: engine.band,
      });
      const result = proposeRebalance(engine, account, next.tickLower, next.tickUpper, 0n, 0n);
      set({ engine, version: version + 1, lastError: null, lastHash: result.hash });
    } catch (e) {
      set({ lastError: e instanceof VaultError ? e.message : "Propose failed", lastHash: null });
    }
  },

  reject: () => {
    try {
      const { engine, account, version } = get();
      const result = rejectProposal(engine, account);
      set({ engine, version: version + 1, lastError: null, lastHash: result.hash });
    } catch (e) {
      set({ lastError: e instanceof VaultError ? e.message : "Reject failed", lastHash: null });
    }
  },

  execute: () => {
    try {
      const { engine, account, version } = get();
      const result = executeRebalance(engine, account);
      set({ engine, version: version + 1, lastError: null, lastHash: result.hash });
    } catch (e) {
      set({ lastError: e instanceof VaultError ? e.message : "Execute failed", lastHash: null });
    }
  },

  reset: () =>
    set({
      engine: liveDemoState(),
      version: 0,
      role: "agent",
      account: DEMO_AGENT,
      lastError: null,
      lastHash: null,
    }),
}));

export { DEMO_AGENT, DEMO_CURATOR, DEMO_USER };
