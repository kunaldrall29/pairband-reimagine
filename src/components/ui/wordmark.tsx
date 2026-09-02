import { cn } from "@/lib/utils";

/** Interlocking pill mark — Pairband brand. */
export function PairMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect
        x="2"
        y="6"
        width="20"
        height="10"
        rx="5"
        transform="rotate(-18 12 11)"
        className="fill-ink dark:fill-paper"
      />
      <rect
        x="10"
        y="16"
        width="20"
        height="10"
        rx="5"
        transform="rotate(-18 20 21)"
        className="fill-teal"
      />
    </svg>
  );
}

export function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const mark = size === "lg" ? 28 : size === "sm" ? 18 : 22;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans font-semibold tracking-tight text-ink lowercase dark:text-paper",
        h,
        className,
      )}
    >
      <PairMark size={mark} />
      pairband
    </span>
  );
}
