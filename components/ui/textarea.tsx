import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--ink-main)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[var(--ink-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]",
        className
      )}
      {...props}
    />
  );
}
