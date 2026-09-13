/**
 * Interactive Pairband product demo recorder.
 * Records real clicks/typing on desktop, then a separate mobile pass.
 * Output webms are muxed with narration via scripts/mux-demo.sh
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.DEMO_BASE || "http://127.0.0.1:8080";
const OUT_DIR = "/workspace/screenshots/demo-assets";
const DESK_DIR = path.join(OUT_DIR, "video-desktop");
const MOB_DIR = path.join(OUT_DIR, "video-mobile");

for (const d of [DESK_DIR, MOB_DIR]) {
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickFirst(page, role, name, wait = 800) {
  const loc = page.getByRole(role, { name }).first();
  if ((await loc.count()) > 0) {
    await loc.click({ timeout: 5000 }).catch(() => {});
    await sleep(wait);
    return true;
  }
  return false;
}

async function fillFirst(page, selector, value) {
  const loc = page.locator(selector).first();
  if ((await loc.count()) > 0) {
    await loc.click();
    await loc.fill("");
    await loc.type(value, { delay: 18 });
    await sleep(400);
    return true;
  }
  return false;
}

async function recordDesktop() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    recordVideo: { dir: DESK_DIR, size: { width: 1280, height: 800 } },
  });
  const page = await context.newPage();

  // 1) Landing (~18s)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2500);
  await page.mouse.wheel(0, 420);
  await sleep(2000);
  await page.mouse.wheel(0, 500);
  await sleep(2000);
  await page.mouse.wheel(0, -900);
  await sleep(1500);

  // Open app
  if (!(await clickFirst(page, "link", /open app|launch app|enter app/i, 2000))) {
    await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    await sleep(2000);
  }

  // 2) Discover (~22s)
  await sleep(1500);
  await fillFirst(page, 'input[placeholder*="Search"], input[type="search"]', "teal");
  await sleep(1200);
  // clear search / show filters
  const search = page.locator('input[placeholder*="Search"], input[type="search"]').first();
  if (await search.count()) {
    await search.fill("");
    await sleep(600);
  }
  for (const label of [/new/i, /market/i, /volume/i, /near/i]) {
    await clickFirst(page, "button", label, 700);
  }
  await clickFirst(page, "button", /new/i, 800);
  await page.mouse.wheel(0, 360);
  await sleep(1500);

  // 3) Token + buy (~28s)
  const card = page.locator('a[href*="/app/t/"]').first();
  if (await card.count()) {
    await card.click();
    await sleep(2500);
    await page.mouse.wheel(0, 200);
    await sleep(1000);
    await fillFirst(page, 'input[inputmode="decimal"], input[type="number"], input[type="text"]', "10");
    await sleep(800);
    await clickFirst(page, "button", /^\$?10$|buy|confirm|place order/i, 2200);
    // try explicit Buy button
    await clickFirst(page, "button", /buy /i, 2000);
    await page.mouse.wheel(0, 280);
    await sleep(1500);
  }

  // Look for a near-graduation / graduated token if Teal Machine exists
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await sleep(1200);
  const teal = page.getByText(/teal machine|TEAL/i).first();
  if (await teal.count()) {
    await teal.click();
    await sleep(2200);
    await page.mouse.wheel(0, 240);
    await sleep(1500);
  }

  // 4) Trade desk (~20s)
  await page.goto(`${BASE}/app/trade`, { waitUntil: "networkidle" });
  await sleep(2000);
  const pair = page.locator("button").filter({ hasText: /PAPER|TEAL|INK|BAND/i }).first();
  if (await pair.count()) {
    await pair.click();
    await sleep(1200);
  }
  await fillFirst(page, 'input[inputmode="decimal"], input[type="number"], input[type="text"]', "25");
  await sleep(800);
  await clickFirst(page, "button", /buy|sell|confirm/i, 1800);
  await page.mouse.wheel(0, 300);
  await sleep(1500);

  // 5) Tape (~12s)
  await page.goto(`${BASE}/app/activity`, { waitUntil: "networkidle" });
  await sleep(2500);
  await page.mouse.wheel(0, 260);
  await sleep(1500);

  // 6) Wallet (~14s)
  await page.goto(`${BASE}/app/me`, { waitUntil: "networkidle" });
  await sleep(2000);
  await clickFirst(page, "button", /faucet|claim|mint/i, 1800);
  await page.mouse.wheel(0, 320);
  await sleep(1500);

  // 7) AI create + launch (~30s)
  await page.goto(`${BASE}/app/create`, { waitUntil: "networkidle" });
  await sleep(1800);
  await fillFirst(
    page,
    "textarea",
    "A community token for indie game developers who ship weekly builds and share revenue on Arc.",
  );
  await sleep(800);
  await clickFirst(page, "button", /generate|ai|draft|suggest/i, 3500);
  await page.mouse.wheel(0, 220);
  await sleep(1200);
  // optional first buy field
  await fillFirst(page, 'input[inputmode="decimal"], input[name*="buy"], input[type="number"]', "5");
  await sleep(600);
  await clickFirst(page, "button", /launch|create token|deploy/i, 2800);
  await sleep(2000);

  // Return to discover to show new listing
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await sleep(2500);

  await context.close();
  await browser.close();
}

async function recordMobile() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: MOB_DIR, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(2000);
  if (!(await clickFirst(page, "link", /open app|trade|launch/i, 1800))) {
    await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    await sleep(1500);
  }

  // Bottom nav tour
  for (const name of [/discover/i, /launch/i, /trade/i, /tape/i, /wallet/i]) {
    await clickFirst(page, "link", name, 1600);
  }
  await clickFirst(page, "link", /discover/i, 1200);
  await page.mouse.wheel(0, 280);
  await sleep(1000);

  const card = page.locator('a[href*="/app/t/"]').first();
  if (await card.count()) {
    await card.click();
    await sleep(2000);
    await fillFirst(page, 'input[inputmode="decimal"], input[type="text"]', "10");
    await clickFirst(page, "button", /buy/i, 1800);
  }

  await clickFirst(page, "link", /trade/i, 1800);
  await sleep(1200);
  await clickFirst(page, "link", /launch/i, 1800);
  await sleep(1500);

  await context.close();
  await browser.close();
}

function pickWebm(dir) {
  const vids = fs.readdirSync(dir).filter((f) => f.endsWith(".webm"));
  if (!vids.length) throw new Error(`No webm in ${dir}`);
  // largest = longest usually
  vids.sort((a, b) => fs.statSync(path.join(dir, b)).size - fs.statSync(path.join(dir, a)).size);
  return path.join(dir, vids[0]);
}

async function main() {
  console.log("Recording desktop…");
  await recordDesktop();
  console.log("Recording mobile…");
  await recordMobile();
  const desk = pickWebm(DESK_DIR);
  const mob = pickWebm(MOB_DIR);
  fs.writeFileSync(
    path.join(OUT_DIR, "record-paths.json"),
    JSON.stringify({ desktop: desk, mobile: mob }, null, 2),
  );
  console.log(JSON.stringify({ desktop: desk, mobile: mob }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
