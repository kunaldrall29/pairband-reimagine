import { cn } from "@/lib/utils";

export function TokenGlyph({
  symbol,
  hue,
  size = 40,
  imageUrl,
  className,
}: {
  symbol: string;
  hue: number;
  size?: number;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const letters = symbol.slice(0, 2);
  const a = `hsl(${hue} 28% 42%)`;
  const b = `hsl(${(hue + 40) % 360} 32% 58%)`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("shrink-0 rounded-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`g-${symbol}-${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#g-${symbol}-${hue})`} />
      <circle cx="20" cy="20" r="19" fill="none" stroke="rgba(244,241,234,0.35)" strokeWidth="1" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F4F1EA"
        fontFamily="IBM Plex Sans, sans-serif"
        fontSize="13"
        fontWeight="600"
      >
        {letters}
      </text>
    </svg>
  );
}
