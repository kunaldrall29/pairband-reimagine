import { cn } from "@/lib/utils";

export function CurveMeter({
  progress,
  label,
  className,
}: {
  progress: number;
  label?: string;
  className?: string;
}) {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>{label ?? "Curve"}</span>
        <span>{Math.round(p * 100)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
        <div
          className="h-full rounded-full bg-teal transition-[width] duration-300 ease-out"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </div>
  );
}
