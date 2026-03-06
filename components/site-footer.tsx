import Link from "next/link";
import type { Route } from "next";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-[var(--line-soft)] bg-[rgba(6,18,25,0.9)]">
      <div className={`mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:px-8 ${compact ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[1.15fr_0.85fr_0.95fr]"}`}>
        <div>
          <p className="font-display text-3xl text-[var(--ink-strong)]">Film Forage</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-dim)]">
            A focused movie-picking tool for the moment when a group needs one real option, not another scroll spiral.
          </p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">Created by Shoaib (Aib) Syed.</p>
          {!compact ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Pick one lead
              </span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Save finalists locally
              </span>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink-muted)]">Routes</p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--ink-dim)]">
            <Link href={"/" as Route} className="hover:text-[var(--ink-main)]">Tonight</Link>
            <Link href={"/search" as Route} className="hover:text-[var(--ink-main)]">Search</Link>
            <Link href={"/watchlist" as Route} className="hover:text-[var(--ink-main)]">Watchlist</Link>
            <Link href={"/sources" as Route} className="hover:text-[var(--ink-main)]">Sources</Link>
          </div>
        </div>

        {!compact ? (
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink-muted)]">Data</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
              Movie metadata is provided by TMDB. Watch availability comes from TMDB&apos;s JustWatch-backed provider data and can vary by region.
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
              When live data drops out, Film Forage falls back to the reserve shelf and says so directly instead of pretending availability is current.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--ink-dim)]">
              <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">TMDB</a>
              <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">JustWatch</a>
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
