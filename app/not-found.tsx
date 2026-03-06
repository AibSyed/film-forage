import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell
      pathname="/"
      eyebrow="Not found"
      title="That movie path does not exist."
      intro="Film Forage only supports the rebuilt shortlist flow. Use the home route or direct title search to keep moving."
    >
      <div className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-8 text-sm text-[var(--ink-dim)]">
        <div className="flex flex-wrap gap-4">
          <Link href={"/" as Route} className="font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">Back to Film Forage</Link>
          <Link href={"/search" as Route} className="font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">Search a title</Link>
        </div>
      </div>
    </PageShell>
  );
}
