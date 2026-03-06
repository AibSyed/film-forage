import Link from "next/link";
import type { Route } from "next";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line-soft)] bg-white/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl text-[var(--ink-strong)]">Film Forage</p>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-dim)]">
            Tonight-picker movie data is provided by TMDB. Watch availability comes from TMDB&apos;s JustWatch-backed provider data and can vary by region.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ink-dim)]">
          <Link href={"/sources" as Route} className="hover:text-[var(--ink-main)]">Sources</Link>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">TMDB</a>
          <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">JustWatch</a>
        </div>
      </div>
    </footer>
  );
}
