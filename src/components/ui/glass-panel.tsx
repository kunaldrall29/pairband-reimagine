import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassPanel({
  className,
  children,
  radius = "xl",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { radius?: "lg" | "xl" | "2xl" }) {
  const r = radius === "lg" ? "rounded-[16px]" : radius === "2xl" ? "rounded-[24px]" : "rounded-[20px]";
  return (
    <div className={cn("glass", r, className)} {...rest}>
      {children}
    </div>
  );
}
