#!/usr/bin/env node
/**
 * Ops-only. Never imported by the app. Reads packages/config/deployer.local.json
 * and broadcasts DeployLaunch.s.sol to Arc Testnet.
 * Private key is passed only via env (never --private-key argv).
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const local = JSON.parse(readFileSync(join(root, "packages/config/deployer.local.json"), "utf8"));
const pk = local.privateKey;
if (!pk?.startsWith("0x")) {
  console.error("deployer.local.json missing privateKey");
  process.exit(1);
}

const body = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBalance",
  params: [local.address, "latest"],
});
const res = await fetch("https://rpc.testnet.arc.io", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body,
});
const json = await res.json();
const balance = BigInt(json.result ?? "0x0");
console.log("deployer", local.address);
console.log("balance wei", balance.toString());
if (balance === 0n) {
  console.error("Fund", local.address, "from https://faucet.circle.com then re-run.");
  process.exit(2);
}

const forge = `${process.env.HOME}/.foundry/bin/forge`;
const r = spawnSync(
  forge,
  [
    "script",
    "script/DeployLaunch.s.sol:DeployLaunch",
    "--rpc-url",
    "https://rpc.testnet.arc.io",
    "--broadcast",
  ],
  {
    cwd: join(root, "packages/contracts"),
    stdio: "inherit",
    env: { ...process.env, PRIVATE_KEY: pk },
  },
);
process.exit(r.status ?? 1);
