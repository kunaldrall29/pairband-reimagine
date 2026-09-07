import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const suggestTokenFromDescription = createServerFn({ method: "POST" })
  .validator((data: unknown) => briefSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; suggestion: TokenSuggestion } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI launch assistant is unavailable in this environment." };
    }

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
              "You help founders name Arc launchpad tokens. Reply with JSON only: {\"name\":\"...\",\"symbol\":\"...\",\"description\":\"...\"}. Symbol must be 2-12 uppercase letters or digits, no spaces. Description is one punchy sentence, 12-280 chars, no emojis.",
          },
          {
            role: "user",
            content: `Brief: ${data.brief}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `AI service error (${res.status}). Try again.` };
    }

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false, error: "AI returned an empty response." };

    try {
      const parsed = suggestionSchema.parse(extractJson(text));
      return { ok: true, suggestion: parsed };
    } catch {
      return { ok: false, error: "Could not parse a valid token from the AI response. Try rephrasing." };
    }
  });
