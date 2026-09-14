#!/usr/bin/env node
/**
 * Copy PGLite wasm/data next to the Nitro server bundle so local
 * `npm run preview` can boot the PGLite fallback (deployed Neon skips this path).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(root, ".vercel/output/functions/__server.func/_libs");

if (!existsSync(join(root, ".vercel/output")) || !existsSync(srcDir)) {
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
for (const name of readdirSync(srcDir)) {
  if (!name.endsWith(".wasm") && !name.endsWith(".data")) continue;
  copyFileSync(join(srcDir, name), join(destDir, name));
  console.log(`[copy-pglite] ${name}`);
}
