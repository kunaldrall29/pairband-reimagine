import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type WebsiteVerifyResult = {
  ok: boolean;
  verified: boolean;
  foundCreator: boolean;
  foundTwitter: boolean;
  error?: string;
};

/**
 * Fetch a creator website and look for Pairband verification markers:
 * - <meta name="pairband:creator" content="0x…">
 * - plain text `pairband-verify:0x…`
 * Optionally confirm an X handle appears on the page.
 */
const verifySchema = z.object({
  website: z.string().min(4).max(300),
  creator: z.string().min(6).max(66),
  twitter: z.string().max(40).optional(),
});

export const verifyTokenWebsite = createServerFn({ method: "POST" })
  .validator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }): Promise<WebsiteVerifyResult> => {
    const creator = data.creator.toLowerCase();
    let url = data.website.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    let html = "";
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "PairbandVerifier/1.0",
        },
        redirect: "follow",
      });
      clearTimeout(timer);
      if (!res.ok) {
        return { ok: false, verified: false, foundCreator: false, foundTwitter: false, error: `HTTP ${res.status}` };
      }
      html = (await res.text()).slice(0, 400_000).toLowerCase();
    } catch (e) {
      return {
        ok: false,
        verified: false,
        foundCreator: false,
        foundTwitter: false,
        error: e instanceof Error ? e.message : "Fetch failed",
      };
    }

    const metaRe = /<meta[^>]+name=["']pairband:creator["'][^>]+content=["']([^"']+)["']/i;
    const metaAlt = /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']pairband:creator["']/i;
    const metaMatch = html.match(metaRe) ?? html.match(metaAlt);
    const metaCreator = metaMatch?.[1]?.toLowerCase() ?? "";
    const plain = html.includes(`pairband-verify:${creator}`) || html.includes(`pairband-verify: ${creator}`);
    const foundCreator = metaCreator === creator || plain;

    let foundTwitter = false;
    if (data.twitter?.trim()) {
      const handle = data.twitter.trim().replace(/^@/, "").toLowerCase();
      foundTwitter =
        html.includes(`twitter.com/${handle}`) ||
        html.includes(`x.com/${handle}`) ||
        html.includes(`@${handle}`);
    }

    return {
      ok: true,
      verified: foundCreator,
      foundCreator,
      foundTwitter,
    };
  });
