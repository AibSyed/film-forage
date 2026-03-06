import Link from "next/link";
import type { Route } from "next";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line-soft)] bg-[rgba(7,20,27,0.92)]">
      <div className={`mx-auto grid w-full max-w-[104rem] gap-6 px-4 py-10 md:px-8 ${compact ? "lg:grid-cols-[1.25fr_0.75fr]" : "lg:grid-cols-[1.05fr_0.65fr_0.9fr]"}`}>
        <div>
          <p className="font-display text-[2rem] uppercase tracking-[0.03em] text-[var(--ink-strong)]">Film Forage</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-dim)]">
            Filter what is available, compare a short list, and save the finalists without creating an account.
          </p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">&copy; {year} Film Forage by Shoaib (Aib) Syed.</p>
          {!compact ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Region-aware</span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Short list</span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Local watchlist</span>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink-muted)]">Routes</p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--ink-dim)]">
            <Link href={("/" as Route)} className="hover:text-[var(--ink-main)]">Home</Link>
            <Link href={("/search" as Route)} className="hover:text-[var(--ink-main)]">Search</Link>
            <Link href={("/watchlist" as Route)} className="hover:text-[var(--ink-main)]">Watchlist</Link>
            <Link href={("/sources" as Route)} className="hover:text-[var(--ink-main)]">Sources</Link>
          </div>
        </div>

        {!compact ? (
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink-muted)]">Data</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
              Movie metadata comes from TMDB. Streaming availability comes from TMDB&apos;s JustWatch-backed provider data and can change by region.
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
              If live data drops out, Film Forage switches to the fallback list and labels it directly instead of pretending the stream data is current.
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
