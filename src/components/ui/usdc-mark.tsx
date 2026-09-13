import { cn } from "@/lib/utils";

/** Circle USDC mark. Official blue; keep size ≥ 16. */
export function UsdcMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        fill="#fff"
        d="M20.55 18.72c0-1.72-1.05-2.78-3.18-3.12v-3.46c1.18.14 1.96.7 2.22 1.68h1.92c-.38-1.84-1.86-2.98-4.14-3.2V9.2h-1.5v1.4c-2.62.2-4.28 1.62-4.28 3.66 0 1.74 1.08 2.82 3.28 3.16v3.52c-1.36-.16-2.28-.78-2.62-1.9h-1.98c.48 2.14 2.16 3.38 4.6 3.58v1.42h1.5v-1.4c2.7-.2 4.38-1.66 4.38-3.72zm-6.36-4.78c0-.84.62-1.36 1.76-1.48v2.98c-1.12-.18-1.76-.7-1.76-1.5zm4.62 4.86c0 .9-.64 1.44-1.86 1.56v-3.16c1.28.18 1.86.74 1.86 1.6z"
      />
    </svg>
  );
}
