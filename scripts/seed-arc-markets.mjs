/**
 * Ops-only: seed a few demo markets on Arc testnet for Discover.
 * Reads packages/config/deployer.local.json (gitignored). Never import from the app.
 *
 *   node --experimental-strip-types scripts/seed-arc-markets.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  formatUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const local = JSON.parse(readFileSync(join(root, "packages/config/deployer.local.json"), "utf8"));
const pk = local.privateKey;
if (!pk) {
  console.error("deployer.local.json missing privateKey");
  process.exit(1);
}

const RPC = local.rpc || "https://rpc.testnet.arc.io";
const LAUNCHPAD = "0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4";
const USDC = "0x3600000000000000000000000000000000000000";

const launchpadAbi = parseAbi([
  "function create(string name_, string symbol_) returns (uint256 id, address token)",
  "function buy(uint256 id, uint256 usdcIn, uint256 minTokensOut) returns (uint256 tokensOut)",
  "function launchCount() view returns (uint256)",
  "function getLaunch(uint256 id) view returns (address token, address pair, address book, address creator, bool graduated, uint256 virtualUsdc, uint256 virtualTokens, uint256 realUsdc, uint256 tokensSold, uint256 protocolFees, uint256 creatorFees)",
]);
const erc20Abi = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
]);

const EXAMPLES = [
  { name: "Helix", symbol: "HELIX", buyUsdc: 2_000_000n }, // $2
  { name: "Harbor", symbol: "HARBOR", buyUsdc: 1_500_000n }, // $1.50
  { name: "Northstar", symbol: "NORTH", buyUsdc: 1_000_000n }, // $1
  { name: "Clayform", symbol: "CLAY", buyUsdc: 1_000_000n }, // $1
];

const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
const publicClient = createPublicClient({ transport: http(RPC) });
const walletClient = createWalletClient({
  account,
  transport: http(RPC),
});

async function ensureAllowance(needed) {
  const allowance = await publicClient.readContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address, LAUNCHPAD],
  });
  if (allowance >= needed) return;
  console.log("approve USDC", formatUnits(needed, 6));
  const hash = await walletClient.writeContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "approve",
    args: [LAUNCHPAD, needed],
    chain: null,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

async function existingSymbols() {
  const count = await publicClient.readContract({
    address: LAUNCHPAD,
    abi: launchpadAbi,
    functionName: "launchCount",
  });
  const out = new Set();
  for (let i = 0n; i < count; i++) {
    const g = await publicClient.readContract({
      address: LAUNCHPAD,
      abi: launchpadAbi,
      functionName: "getLaunch",
      args: [i],
    });
    try {
      const sym = await publicClient.readContract({
        address: g[0],
        abi: erc20Abi,
        functionName: "symbol",
      });
      out.add(String(sym).toUpperCase());
    } catch {
      /* skip */
    }
  }
  return out;
}

const bal = await publicClient.readContract({
  address: USDC,
  abi: erc20Abi,
  functionName: "balanceOf",
  args: [account.address],
});
console.log("deployer", account.address, "USDC", formatUnits(bal, 6));

const known = await existingSymbols();
console.log("existing", [...known]);

const totalNeed = EXAMPLES.reduce((a, e) => a + 1_000_000n + e.buyUsdc, 0n);
await ensureAllowance(totalNeed);

for (const ex of EXAMPLES) {
  if (known.has(ex.symbol.toUpperCase())) {
    console.log("skip existing", ex.symbol);
    continue;
  }
  console.log("create", ex.name, ex.symbol);
  const createHash = await walletClient.writeContract({
    address: LAUNCHPAD,
    abi: launchpadAbi,
    functionName: "create",
    args: [ex.name, ex.symbol],
    chain: null,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: createHash });
  const count = await publicClient.readContract({
    address: LAUNCHPAD,
    abi: launchpadAbi,
    functionName: "launchCount",
  });
  const id = count - 1n;
  console.log("  id", id.toString(), "tx", createHash, "block", receipt.blockNumber.toString());

  if (ex.buyUsdc > 0n) {
    const left = await publicClient.readContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address],
    });
    const spend = ex.buyUsdc < left ? ex.buyUsdc : left > 500_000n ? left - 500_000n : 0n;
    if (spend <= 0n) {
      console.log("  skip buy — low USDC", formatUnits(left, 6));
    } else {
      console.log("  buy", formatUnits(spend, 6), "USDC (bal", formatUnits(left, 6) + ")");
      try {
        const buyHash = await walletClient.writeContract({
          address: LAUNCHPAD,
          abi: launchpadAbi,
          functionName: "buy",
          args: [id, spend, 0n],
          chain: null,
        });
        await publicClient.waitForTransactionReceipt({ hash: buyHash });
        console.log("  buy tx", buyHash);
      } catch (e) {
        console.warn("  buy failed:", e.shortMessage || e.message);
      }
    }
  }
}

const finalCount = await publicClient.readContract({
  address: LAUNCHPAD,
  abi: launchpadAbi,
  functionName: "launchCount",
});
console.log("launchCount", finalCount.toString());
