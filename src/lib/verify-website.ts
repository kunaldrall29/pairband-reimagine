import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type WebsiteVerifyResult = {
  ok: boolean;
  verified: boolean;
  foundCreator: boolean;
  foundTwitter: boolean;
  twitterMetaMatch: boolean;
  fetchedUrl?: string;
  error?: string;
};

/**
 * Fetch a creator website and look for Pairband verification markers:
 * - <meta name="pairband:creator" content="0x…">
 * - <meta name="pairband:twitter" content="handle">
 * - plain text `pairband-verify:0x…`
 * Optionally confirm an X handle appears on the page.
 */
const verifySchema = z.object({
  website: z.string().min(4).max(300),
  creator: z.string().min(6).max(66),
  twitter: z.string().max(40).optional(),
});

function metaContent(html: string, name: string): string {
  const re1 = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`,
    "i",
  );
  return (html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? "").trim();
}

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
          "User-Agent": "PairbandVerifier/1.0 (+https://pairband.com)",
        },
        redirect: "follow",
      });
      clearTimeout(timer);
      if (!res.ok) {
        return {
          ok: false,
          verified: false,
          foundCreator: false,
          foundTwitter: false,
          twitterMetaMatch: false,
          error: `HTTP ${res.status}`,
        };
      }
      html = (await res.text()).slice(0, 400_000);
    } catch (e) {
      return {
        ok: false,
        verified: false,
        foundCreator: false,
        foundTwitter: false,
        twitterMetaMatch: false,
        error: e instanceof Error ? e.message : "Fetch failed",
      };
    }

    const lower = html.toLowerCase();
    const metaCreator = metaContent(html, "pairband:creator").toLowerCase();
    const plain =
      lower.includes(`pairband-verify:${creator}`) ||
      lower.includes(`pairband-verify: ${creator}`);
    const foundCreator = metaCreator === creator || plain;

    const handle = data.twitter?.trim().replace(/^@/, "").toLowerCase() ?? "";
    const twitterMeta = metaContent(html, "pairband:twitter").replace(/^@/, "").toLowerCase();
    const twitterMetaMatch = Boolean(handle && twitterMeta === handle);

    let foundTwitter = twitterMetaMatch;
    if (handle) {
      foundTwitter =
        twitterMetaMatch ||
        lower.includes(`twitter.com/${handle}`) ||
        lower.includes(`x.com/${handle}`) ||
        lower.includes(`@${handle}`);
    }

    return {
      ok: true,
      verified: foundCreator,
      foundCreator,
      foundTwitter,
      twitterMetaMatch,
      fetchedUrl: url,
    };
  });
