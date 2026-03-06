import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--line-soft)] bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-dim)]",
        className
      )}
      {...props}
    />
  );
}
