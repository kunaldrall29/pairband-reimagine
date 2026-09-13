import { cn } from "@/lib/utils";

export function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const mark = size === "lg" ? 26 : size === "sm" ? 18 : 22;
  return (
    <span className={cn("inline-flex items-center gap-2 font-display tracking-tight text-ink dark:text-paper", h, className)}>
      <svg width={mark} height={mark} viewBox="0 0 24 24" aria-hidden className="shrink-0">
        <path d="M2 9.5c4-3 8 3 12 0s8 3 8 3" fill="none" stroke="#E8B86D" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M2 14.5c4-3 8 3 12 0s8 3 8 3" fill="none" stroke="#3D9B8F" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      Pairband
    </span>
  );
}
