/** Minimal ABIs generated to match PairbandVault / PairbandHook / Factory. */

export const pairbandVaultAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "a", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalLiquidity", stateMutability: "view", inputs: [], outputs: [{ type: "uint128" }] },
  { type: "function", name: "rebalanceUnlockBlock", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "band",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "tickLower", type: "int24" },
      { name: "tickUpper", type: "int24" },
      { name: "positionId", type: "uint256" },
      { name: "lastRebalanceAt", type: "uint48" },
    ],
  },
  {
    type: "function",
    name: "policy",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "curator", type: "address" },
      { name: "agent", type: "address" },
      { name: "maxWidth", type: "uint24" },
      { name: "maxShift", type: "uint24" },
      { name: "minCooldown", type: "uint32" },
      { name: "protocolFeeBps", type: "uint16" },
      { name: "performanceFeeBps", type: "uint16" },
      { name: "proposalDelay", type: "uint32" },
    ],
  },
  {
    type: "function",
    name: "proposal",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "tickLower", type: "int24" },
      { name: "tickUpper", type: "int24" },
      { name: "amount0Min", type: "uint128" },
      { name: "amount1Min", type: "uint128" },
      { name: "proposer", type: "address" },
      { name: "postedAt", type: "uint48" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "previewDeposit",
    stateMutability: "view",
    inputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
    outputs: [
      { name: "shares", type: "uint256" },
      { name: "liquidity", type: "uint128" },
    ],
  },
  {
    type: "function",
    name: "previewWithdraw",
    stateMutability: "view",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "shares", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "proposeRebalance",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tickLower", type: "int24" },
      { name: "tickUpper", type: "int24" },
      { name: "amount0Min", type: "uint128" },
      { name: "amount1Min", type: "uint128" },
    ],
    outputs: [],
  },
  { type: "function", name: "executeRebalance", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "rejectProposal", stateMutability: "nonpayable", inputs: [], outputs: [] },
  {
    type: "error",
    name: "NotCurator",
    inputs: [],
  },
  { type: "error", name: "NotAgent", inputs: [] },
  { type: "error", name: "NotVault", inputs: [] },
  { type: "error", name: "TooWide", inputs: [] },
  { type: "error", name: "ShiftCapped", inputs: [] },
  { type: "error", name: "DelayPending", inputs: [] },
  { type: "error", name: "CooldownPending", inputs: [] },
  { type: "error", name: "NoProposal", inputs: [] },
  { type: "error", name: "Locked", inputs: [] },
  { type: "error", name: "ZeroAmount", inputs: [] },
  { type: "error", name: "InvalidTicks", inputs: [] },
  { type: "error", name: "FeeCap", inputs: [] },
] as const;

export const pairbandHookAbi = [
  {
    type: "function",
    name: "vaultOf",
    stateMutability: "view",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "event",
    name: "SwapTouched",
    inputs: [
      { name: "poolId", type: "bytes32", indexed: true },
      { name: "tick", type: "int24", indexed: false },
      { name: "sqrtPriceX96", type: "uint160", indexed: false },
    ],
  },
] as const;

export const stateViewAbi = [
  {
    type: "function",
    name: "getSlot0",
    stateMutability: "view",
    inputs: [{ name: "poolId", type: "bytes32" }],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "protocolFee", type: "uint24" },
      { name: "lpFee", type: "uint24" },
    ],
  },
  {
    type: "function",
    name: "getLiquidity",
    stateMutability: "view",
    inputs: [{ name: "poolId", type: "bytes32" }],
    outputs: [{ type: "uint128" }],
  },
] as const;

export const CUSTOM_ERRORS = [
  "NotCurator",
  "NotAgent",
  "NotVault",
  "TooWide",
  "ShiftCapped",
  "DelayPending",
  "CooldownPending",
  "NoProposal",
  "Locked",
  "ZeroAmount",
  "InvalidTicks",
  "FeeCap",
] as const;
