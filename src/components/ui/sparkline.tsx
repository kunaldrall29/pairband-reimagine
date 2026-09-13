import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  className,
  up,
}: {
  values: number[];
  className?: string;
  up?: boolean;
}) {
  const w = 120;
  const h = 36;
  if (values.length < 2) {
    return <svg width={w} height={h} className={className} aria-hidden />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - 4 - ((v - min) / span) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const positive = up ?? values[values.length - 1]! >= values[0]!;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cn("overflow-visible", className)} aria-hidden>
      <polyline
        fill="none"
        stroke={positive ? "#3D9B8F" : "#C45C4A"}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}
