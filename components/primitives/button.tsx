import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-body text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  {
    variants: {
      variant: {
        primary: "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-300",
        ghost: "border border-zinc-700 bg-zinc-900/70 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
