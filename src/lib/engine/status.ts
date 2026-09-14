import type { Launch, LaunchStatus } from "./types.ts";

/** Normalize legacy "graduated" persisted status → stage_b. */
export function normalizeStatus(raw: string | undefined): LaunchStatus {
  if (raw === "stage_a") return "stage_a";
  if (raw === "stage_b" || raw === "graduated") return "stage_b";
  return "curve";
}

export function isStageB(launch: Launch): boolean {
  return launch.status === "stage_b";
}

export function isStageA(launch: Launch): boolean {
  return launch.status === "stage_a";
}

/** Book is live from Stage A onward. */
export function hasBook(launch: Launch): boolean {
  return launch.status === "stage_a" || launch.status === "stage_b";
}

/** Curve stays open through Stage A; closes at Stage B. */
export function isCurveOpen(launch: Launch): boolean {
  return launch.status === "curve" || launch.status === "stage_a";
}

export function statusLabel(status: LaunchStatus): string {
  switch (status) {
    case "curve":
      return "Curve";
    case "stage_a":
      return "Stage A Book";
    case "stage_b":
      return "Stage B Locked";
  }
}

export function statusChip(status: LaunchStatus): { label: string; tone: "curve" | "book" | "locked" } {
  switch (status) {
    case "curve":
      return { label: "Curve", tone: "curve" };
    case "stage_a":
      return { label: "Stage A Book", tone: "book" };
    case "stage_b":
      return { label: "Stage B Locked", tone: "locked" };
  }
}
