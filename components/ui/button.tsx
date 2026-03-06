import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent-strong)] px-5 py-3 text-[var(--ink-strong)] hover:bg-[var(--accent-soft)] focus-visible:ring-[var(--accent-strong)]",
        secondary: "border border-[var(--line-strong)] bg-white/70 px-5 py-3 text-[var(--ink-main)] hover:border-[var(--accent-muted)] hover:bg-white",
        ghost: "px-4 py-2 text-[var(--ink-dim)] hover:bg-white/70 hover:text-[var(--ink-main)]",
        subtle: "border border-[var(--line-soft)] bg-[var(--panel-muted)] px-4 py-2 text-[var(--ink-main)] hover:border-[var(--line-strong)] hover:bg-white",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
