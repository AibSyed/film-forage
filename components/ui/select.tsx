import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function SelectField({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--ink-main)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
