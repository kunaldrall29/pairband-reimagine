"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export function PriceChart({
  points,
  className,
}: {
  points: Array<{ t: number; p: number }>;
  className?: string;
}) {
  const data =
    points.length >= 2
      ? points.map((d) => ({
          t: d.t,
          p: d.p,
          label: new Date(d.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }))
      : [
          { t: 0, p: 0.08, label: "—" },
          { t: 1, p: 0.081, label: "—" },
        ];
  const up = data[data.length - 1]!.p >= data[0]!.p;
  const stroke = up ? "#3D9B8F" : "#C45C4A";
  const fillId = up ? "pxUp" : "pxDn";

  return (
    <div className={cn("h-56 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pxUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D9B8F" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3D9B8F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pxDn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C45C4A" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#C45C4A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "#F4F1EA",
              border: "1px solid rgba(11,15,20,0.1)",
              borderRadius: 12,
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 12,
            }}
            formatter={(v: number) => [`$${v.toPrecision(6)}`, "Price"]}
          />
          <Area type="monotone" dataKey="p" stroke={stroke} strokeWidth={1.8} fill={`url(#${fillId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
