import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-dim)]",
        className
      )}
      {...props}
    />
  );
}
