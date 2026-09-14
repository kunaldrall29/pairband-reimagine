"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type StepKind = "create" | "curve" | "book";

/** Brand step art — CSS primary, photo enhancement when the still loads. */
export function StepArt({
  kind,
  still,
  alt,
  className,
}: {
  kind: StepKind;
  still: string;
  alt: string;
  className?: string;
}) {
  const [photoOk, setPhotoOk] = useState(false);

  // Cached images often finish before onLoad is attached — check complete on bind.
  const bindImg = useCallback((el: HTMLImageElement | null) => {
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) setPhotoOk(true);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden bg-[#eceae4] sm:aspect-[4/3]",
        className,
      )}
    >
      <div className="absolute inset-0" aria-hidden>
        {kind === "create" ? <CreateArt /> : null}
        {kind === "curve" ? <CurveArt /> : null}
        {kind === "book" ? <BookArt /> : null}
      </div>
      <img
        ref={bindImg}
        src={still}
        alt={photoOk ? alt : ""}
        aria-hidden={!photoOk}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          photoOk ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        loading="lazy"
        decoding="async"
        onLoad={() => setPhotoOk(true)}
        onError={() => setPhotoOk(false)}
      />
    </div>
  );
}

function CreateArt() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(42,46,50,0.12),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(79,179,165,0.28),transparent_55%),linear-gradient(165deg,#f3f1ec,#e7e4dc)]">
      <div className="absolute top-[22%] left-[18%] size-[38%] rounded-full bg-[#cbb79a] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.1)]" />
      <div className="absolute top-[28%] right-[16%] size-[34%] rounded-full bg-[#7aa8a0] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.1),0_12px_28px_rgba(0,0,0,0.08)]" />
      <div className="absolute top-1/2 left-1/2 h-[22%] w-[58%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-white/60 bg-gradient-to-r from-[#E8B86D]/55 via-white/35 to-[#3D9B8F]/55 shadow-[0_8px_24px_rgba(61,155,143,0.2)] backdrop-blur-[2px]" />
    </div>
  );
}

function CurveArt() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(160deg,#f5f3ee,#ebe8e1)] p-[12%]">
      <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/70 bg-white/45 shadow-[0_16px_40px_rgba(26,26,26,0.08)] backdrop-blur-md">
        <div className="absolute inset-x-0 top-[18%] h-[22%] bg-gradient-to-r from-[#E8B86D]/50 via-[#E8B86D]/15 to-transparent" />
        <div className="absolute inset-x-0 top-[42%] h-[22%] bg-gradient-to-r from-transparent via-[#3D9B8F]/35 to-[#3D9B8F]/55" />
        <div className="absolute right-[12%] bottom-[14%] left-[12%] h-px bg-ink/10" />
        <div className="absolute right-[12%] bottom-[14%] left-[12%] h-16 origin-bottom-left scale-y-[0.85]">
          <svg viewBox="0 0 200 64" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
            <path
              d="M0 56 C40 56 55 8 100 8 C145 8 160 56 200 56"
              fill="none"
              stroke="#3D9B8F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BookArt() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(79,179,165,0.2),transparent_45%),linear-gradient(180deg,#f2f0ea,#e5e2da)]">
      <div className="absolute top-[16%] right-[10%] left-[10%] h-[58%] rounded-[16px] border border-ink/8 bg-[#faf9f6] shadow-[0_18px_36px_rgba(26,26,26,0.1)]">
        <div className="absolute top-3 left-3 right-3 flex gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-ink/15" />
          <span className="h-1.5 w-12 rounded-full bg-teal/40" />
        </div>
        <div className="absolute inset-x-3 top-8 bottom-3 grid grid-cols-3 gap-1.5">
          {[0.35, 0.55, 0.8].map((h, i) => (
            <div key={i} className="flex items-end rounded-md bg-ink/[0.04] p-1.5">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-teal/70 to-teal/25"
                style={{ height: `${h * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[18%] bottom-[10%] size-10 rounded-lg border border-ink/10 bg-[#2a2e32] shadow-md" />
    </div>
  );
}
