import Link from "next/link";
import type { Route } from "next";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line-soft)] bg-[linear-gradient(180deg,rgba(7,12,18,0.98),rgba(4,9,14,0.98))]">
      <div className={`mx-auto grid w-full max-w-[118rem] gap-6 px-4 ${compact ? "py-6 md:py-7 lg:grid-cols-[1.2fr_1fr]" : "py-10 md:px-8 lg:grid-cols-[1.5fr_1fr_1.2fr]"}`}>
        <div className="space-y-3">
          <p className="font-display text-[2rem] text-[var(--ink-strong)]">Film Forage</p>
          <p className="max-w-2xl text-sm leading-7 text-[var(--ink-dim)]">
            Choose a region, narrow by service and runtime, and keep only the movies you would actually watch.
          </p>
          <p className="text-sm text-[var(--ink-muted)]">&copy; {year} Film Forage by Shoaib (Aib) Syed.</p>
          {!compact ? <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">Filter with intent • compare quickly • keep a clean watchlist</p> : null}
        </div>

        <div className="grid content-start gap-3 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)]">Explore</p>
          <div className="grid gap-2 text-[var(--ink-dim)]">
            <Link href={("/" as Route)} className="hover:text-[var(--ink-main)]">Home</Link>
            <Link href={("/search" as Route)} className="hover:text-[var(--ink-main)]">Search</Link>
            <Link href={("/watchlist" as Route)} className="hover:text-[var(--ink-main)]">Watchlist</Link>
            <Link href={("/sources" as Route)} className="hover:text-[var(--ink-main)]">Sources</Link>
          </div>
        </div>

        {!compact ? (
          <div className="grid content-start gap-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)]">Data and Availability</p>
            <p className="leading-7 text-[var(--ink-dim)]">
              Live movie metadata and provider availability come from TMDB. If live calls fail, Film Forage uses clearly labeled reserve titles.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[var(--ink-dim)]">
              <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">TMDB</a>
              <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">JustWatch</a>
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
