"use client";

import { cn } from "@/lib/utils";
import { statusChip } from "@/lib/engine/status.ts";
import type { LaunchStatus } from "@/lib/engine/types.ts";

const TONE: Record<string, string> = {
  curve: "bg-amber/20 text-amber-2 dark:bg-amber/25 dark:text-amber",
  book: "bg-teal/15 text-teal-2 dark:bg-teal/20 dark:text-teal",
  locked: "bg-ink/90 text-paper dark:bg-paper/90 dark:text-ink",
};

export function StatusChip({
  status,
  className,
  compact,
}: {
  status: LaunchStatus | string;
  className?: string;
  compact?: boolean;
}) {
  const normalized =
    status === "graduated" ? "stage_b" : status === "stage_a" || status === "stage_b" || status === "curve" ? status : "curve";
  const chip = statusChip(normalized);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-mono uppercase tracking-wide",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        TONE[chip.tone],
        className,
      )}
    >
      {chip.label}
    </span>
  );
}
