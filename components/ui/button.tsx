import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
  {
    variants: {
      variant: {
        primary: "bg-[linear-gradient(135deg,var(--accent-soft),var(--accent-strong))] px-5 py-3 text-[#131c22] shadow-[0_18px_38px_rgba(216,159,84,0.25)] hover:translate-y-[-1px] hover:shadow-[0_22px_42px_rgba(216,159,84,0.32)] focus-visible:ring-[var(--accent-strong)]",
        secondary: "border border-[var(--line-strong)] bg-[var(--surface-soft)] px-5 py-3 text-[var(--ink-main)] hover:border-[var(--accent-strong)] hover:bg-[var(--surface-raised)]",
        ghost: "px-4 py-2 text-[var(--ink-dim)] hover:bg-[var(--panel-muted)] hover:text-[var(--ink-main)]",
        subtle: "border border-[var(--line-soft)] bg-[var(--panel-muted)] px-4 py-2 text-[var(--ink-main)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-soft)]",
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
