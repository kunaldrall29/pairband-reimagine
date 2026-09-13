"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_16px_rgba(11,15,20,0.22)] hover:bg-ink-2 dark:bg-paper dark:text-ink dark:hover:bg-paper-2",
  secondary:
    "bg-paper text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_18px_rgba(11,15,20,0.12)] border border-ink/8 hover:bg-paper-2 dark:bg-ink-2 dark:text-paper dark:border-paper/15",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 border border-ink/10 dark:text-paper dark:border-paper/15 dark:hover:bg-paper/5",
  danger:
    "bg-danger text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-95",
};

export function ClayButton({
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium tracking-tight",
        "transition-[background,box-shadow,transform] duration-150 ease-out",
        "active:not-disabled:translate-y-px active:not-disabled:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
