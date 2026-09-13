import { cn } from "@/lib/utils";

/** Arc gateway mark. Silver on dark, ink on paper. */
export function ArcMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        fill="currentColor"
        d="M5.2 25.8C5.2 14.4 14.2 6.6 26.2 6.6c.7 0 1.4.04 2.1.12v5.05c-.7-.12-1.4-.18-2.1-.18-8.1 0-13.7 5.1-13.7 13.1 0 .7.04 1.4.12 2.1H5.4c-.14-.7-.2-1.4-.2-2.1z"
      />
    </svg>
  );
}
