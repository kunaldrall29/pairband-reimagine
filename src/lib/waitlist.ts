import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";

const walletRe = /^0x[a-fA-F0-9]{40}$/;

const joinSchema = z.object({
  wallet: z.string().regex(walletRe, "Valid Arc wallet required"),
  interest: z.enum(["launch", "trade"]),
  projectName: z.string().trim().max(64).optional(),
  xHandle: z
    .string()
    .trim()
    .max(32)
    .optional()
    .transform((v) => (v ? v.replace(/^@/, "") : undefined)),
  pitch: z.string().trim().max(280).optional(),
});

export type WaitlistEntry = {
  id: number;
  wallet: string;
  interest: "launch" | "trade";
  project_name: string | null;
  x_handle: string | null;
  pitch: string | null;
  created_at: string;
};

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((data: unknown) => joinSchema.parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.interest === "launch" && !data.projectName?.trim()) {
      throw new Error("Project name required for launch access");
    }
    const wallet = data.wallet.toLowerCase();
    const rows = await sql<WaitlistEntry>`
      insert into waitlist (wallet, interest, project_name, x_handle, pitch)
      values (
        ${wallet},
        ${data.interest},
        ${data.projectName?.trim() || null},
        ${data.xHandle || null},
        ${data.pitch?.trim() || null}
      )
      on conflict (wallet, interest) do update set
        project_name = excluded.project_name,
        x_handle = excluded.x_handle,
        pitch = excluded.pitch
      returning id, wallet, interest, project_name, x_handle, pitch, created_at::text
    `;
    return rows[0]!;
  });

export const waitlistStats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ interest: string; n: number }>`
    select interest, count(*)::int as n from waitlist group by interest
  `;
  const launch = rows.find((r) => r.interest === "launch")?.n ?? 0;
  const trade = rows.find((r) => r.interest === "trade")?.n ?? 0;
  return { launch, trade, total: launch + trade };
});
