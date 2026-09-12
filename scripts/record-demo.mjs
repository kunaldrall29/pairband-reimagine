import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.DEMO_BASE || "http://127.0.0.1:8080";
const OUT_DIR = "/workspace/screenshots/demo-assets";
const VIDEO_DIR = path.join(OUT_DIR, "video-raw");
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  });
  const page = await context.newPage();

  async function go(url, wait = 1800) {
    await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });
    await sleep(wait);
  }

  // Landing
  await go("/", 3500);
  await page.screenshot({ path: path.join(OUT_DIR, "01-landing.png"), fullPage: false });

  // Open app
  const open = page.getByRole("link", { name: /open app|trade|launch/i }).first();
  if (await open.count()) {
    await open.click();
    await sleep(2500);
  } else {
    await go("/app", 2500);
  }
  await page.screenshot({ path: path.join(OUT_DIR, "02-discover.png") });

  // Filters / scroll
  await page.mouse.wheel(0, 400);
  await sleep(1200);

  // Open a token if present
  const card = page.locator("a[href*='/app/t/']").first();
  if (await card.count()) {
    await card.click();
    await sleep(2500);
    await page.screenshot({ path: path.join(OUT_DIR, "03-token.png") });

    // Try buy
    const amount = page.locator('input[inputmode="decimal"], input[type="text"]').first();
    if (await amount.count()) {
      await amount.fill("10");
      await sleep(600);
    }
    const buy = page.getByRole("button", { name: /buy|confirm|place/i }).first();
    if (await buy.count()) {
      await buy.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(OUT_DIR, "04-buy.png") });
    }
  }

  // Trade
  await go("/app/trade", 2500);
  await page.screenshot({ path: path.join(OUT_DIR, "05-trade.png") });
  await page.mouse.wheel(0, 300);
  await sleep(1000);

  // Activity / tape
  for (const pathName of ["/app/activity", "/app/tape"]) {
    try {
      await go(pathName, 1800);
      break;
    } catch {}
  }
  await page.screenshot({ path: path.join(OUT_DIR, "06-tape.png") });

  // Wallet
  for (const pathName of ["/app/me", "/app/wallet"]) {
    try {
      await go(pathName, 1800);
      break;
    } catch {}
  }
  await page.screenshot({ path: path.join(OUT_DIR, "07-wallet.png") });
  const faucet = page.getByRole("button", { name: /faucet|claim/i }).first();
  if (await faucet.count()) {
    await faucet.click();
    await sleep(1500);
  }

  // Create / Launch
  await go("/app/create", 2500);
  await page.screenshot({ path: path.join(OUT_DIR, "08-create.png") });
  const brief = page.locator("textarea").first();
  if (await brief.count()) {
    await brief.fill(
      "A community token for indie game developers who ship weekly builds and share revenue on Arc.",
    );
    await sleep(500);
    const gen = page.getByRole("button", { name: /generate|ai|draft/i }).first();
    if (await gen.count()) {
      await gen.click();
      await sleep(3000);
      await page.screenshot({ path: path.join(OUT_DIR, "09-ai-draft.png") });
    }
    const launchBtn = page.getByRole("button", { name: /launch/i }).first();
    if (await launchBtn.count()) {
      await launchBtn.click();
      await sleep(2500);
      await page.screenshot({ path: path.join(OUT_DIR, "10-launched.png") });
    }
  }

  // Mobile viewport pass
  await page.setViewportSize({ width: 390, height: 844 });
  await go("/app", 2000);
  await page.screenshot({ path: path.join(OUT_DIR, "11-mobile-discover.png") });
  await go("/app/trade", 2000);
  await page.screenshot({ path: path.join(OUT_DIR, "12-mobile-trade.png") });
  await go("/app/create", 2000);
  await page.screenshot({ path: path.join(OUT_DIR, "13-mobile-create.png") });

  // Linger for audio length (~150s already partially used; pad)
  await go("/", 4000);
  await go("/app", 4000);
  await go("/app/trade", 4000);
  await go("/app/create", 4000);
  await go("/app/me", 4000);

  await context.close();
  await browser.close();

  const vids = fs.readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
  console.log(JSON.stringify({ videos: vids, out: VIDEO_DIR }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
