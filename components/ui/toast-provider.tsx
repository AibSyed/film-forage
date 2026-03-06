"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border !border-[var(--line-soft)] !bg-[var(--surface-raised)] !text-[var(--ink-main)]",
          title: "!text-[var(--ink-strong)]",
          description: "!text-[var(--ink-dim)]",
          actionButton: "!bg-[var(--accent-strong)] !text-[#101820]",
          cancelButton: "!bg-[var(--panel-muted)] !text-[var(--ink-main)]",
        },
      }}
    />
  );
}
