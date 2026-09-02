"use client";

import { cn } from "@/lib/utils";

/** Frosted interlocking capsules — brand hero visual. */
export function HeroPills({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate h-full min-h-[280px] w-full overflow-hidden rounded-[28px]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(42,46,50,0.22),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(79,179,165,0.35),transparent_50%),linear-gradient(160deg,#ecece7,#f5f5f2_45%,#e8f4f1)]" />
      <div
        className="pill-float absolute top-[12%] right-[8%] h-[42%] w-[78%] rounded-full"
        style={{ ["--pill-rot" as string]: "-22deg" }}
      >
        <div className="h-full w-full rounded-full border border-white/50 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_24px_48px_rgba(26,26,26,0.12)] backdrop-blur-2xl" />
      </div>
      <div
        className="pill-float pill-float-delay absolute bottom-[8%] left-[4%] h-[38%] w-[72%] rounded-full"
        style={{ ["--pill-rot" as string]: "-16deg" }}
      >
        <div className="h-full w-full rounded-full border border-teal-soft/30 bg-gradient-to-br from-white/50 to-teal/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_40px_rgba(61,155,143,0.18)] backdrop-blur-2xl" />
      </div>
      <div className="absolute top-1/2 left-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/15 blur-3xl" />
    </div>
  );
}
