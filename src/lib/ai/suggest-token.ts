import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  AGENT_FEE_ONCHAIN_USDC,
  AGENT_FEE_USDC,
  AMM_FEE_BPS,
  CREATOR_FEE_BPS,
  LAUNCH_FEE_ONCHAIN_USDC,
  LAUNCH_FEE_USDC,
  PROTOCOL_FEE_BPS,
  TREASURY,
} from "@/lib/engine/constants.ts";

export type FeeSchedule = {
  launchFeeUsdc: string;
  launchFeeOnChain: string;
  agentFeeUsdc: string;
  agentFeeOnChain: string;
  protocolFeeBps: number;
  creatorFeeBps: number;
  ammFeeBps: number;
  treasury: string;
  quoteAsset: "USDC";
  settlementChain: "Arc";
};

/** Public fee schedule — used by docs, create UI, and agents. */
export const getFeeSchedule = createServerFn({ method: "GET" }).handler(async (): Promise<FeeSchedule> => {
  return {
    launchFeeUsdc: LAUNCH_FEE_USDC.toString(),
    launchFeeOnChain: LAUNCH_FEE_ONCHAIN_USDC.toString(),
    agentFeeUsdc: AGENT_FEE_USDC.toString(),
    agentFeeOnChain: AGENT_FEE_ONCHAIN_USDC.toString(),
    protocolFeeBps: Number(PROTOCOL_FEE_BPS),
    creatorFeeBps: Number(CREATOR_FEE_BPS),
    ammFeeBps: Number(AMM_FEE_BPS),
    treasury: TREASURY,
    quoteAsset: "USDC",
    settlementChain: "Arc",
  };
});

const briefSchema = z.object({
  brief: z
    .string()
    .trim()
    .min(8, "Describe your token in at least 8 characters.")
    .max(500, "Keep the brief under 500 characters."),
});

const suggestionSchema = z.object({
  name: z.string().trim().min(2).max(32),
  symbol: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{2,12}$/),
  description: z.string().trim().min(12).max(280),
});

export type TokenSuggestion = z.infer<typeof suggestionSchema>;

function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? raw).trim();
  return JSON.parse(body);
}

/** Deterministic local draft so create flow works when XAI_API_KEY is absent. */
export function localTokenSuggestion(brief: string): TokenSuggestion {
  const cleaned = brief.replace(/\s+/g, " ").trim();
  const words = cleaned
    .split(/[^a-zA-Z0-9]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
  const lead = words[0] ?? "Pair";
  const second = words[1] ?? "Band";
  const name = `${lead[0]!.toUpperCase()}${lead.slice(1).toLowerCase()} ${second[0]!.toUpperCase()}${second
    .slice(1)
    .toLowerCase()}`.slice(0, 32);
  const symbol = (lead.slice(0, 3) + second.slice(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const safeSymbol = (symbol.length >= 2 ? symbol : "PBND").padEnd(2, "X").slice(0, 12);
  const description = cleaned.slice(0, 280);
  return suggestionSchema.parse({
    name: name.length >= 2 ? name : "Pairband Token",
    symbol: safeSymbol,
    description: description.length >= 12 ? description : `${cleaned} — launched on Arc with Pairband.`,
  });
}

export const suggestTokenFromDescription = createServerFn({ method: "POST" })
  .validator((data: unknown) => briefSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; suggestion: TokenSuggestion; source: "grok" | "local" } | { ok: false; error: string }> => {
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) {
        return { ok: true, suggestion: localTokenSuggestion(data.brief), source: "local" };
      }

      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            temperature: 0.4,
            max_tokens: 220,
            messages: [
              {
                role: "system",
                content:
                  'You help founders name Arc launchpad tokens. Reply with JSON only: {"name":"...","symbol":"...","description":"..."}. Symbol must be 2-12 uppercase letters or digits, no spaces. Description is one punchy sentence, 12-280 chars, no emojis.',
              },
              {
                role: "user",
                content: `Brief: ${data.brief}`,
              },
            ],
          }),
        });

        if (!res.ok) {
          return { ok: true, suggestion: localTokenSuggestion(data.brief), source: "local" };
        }

        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content?.trim();
        if (!text) {
          return { ok: true, suggestion: localTokenSuggestion(data.brief), source: "local" };
        }

        try {
          const parsed = suggestionSchema.parse(extractJson(text));
          return { ok: true, suggestion: parsed, source: "grok" };
        } catch {
          return { ok: true, suggestion: localTokenSuggestion(data.brief), source: "local" };
        }
      } catch {
        return { ok: true, suggestion: localTokenSuggestion(data.brief), source: "local" };
      }
    },
  );
