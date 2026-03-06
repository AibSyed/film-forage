import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--line-soft)] bg-white px-4 text-sm text-[var(--ink-main)] shadow-[0_1px_0_rgba(39,30,22,0.04)] placeholder:text-[var(--ink-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]",
        className
      )}
      {...props}
    />
  );
}
