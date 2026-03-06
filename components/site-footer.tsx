import Link from "next/link";
import type { Route } from "next";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line-soft)] bg-[rgba(7,12,18,0.94)]">
      <div className={`mx-auto grid w-full max-w-[118rem] gap-5 px-4 ${compact ? "py-6 md:py-7 lg:grid-cols-[1fr_auto]" : "py-10 md:px-8 lg:grid-cols-[1fr_auto]"}`}>
        <div>
          <p className="font-display text-[1.9rem] text-[var(--ink-strong)]">Film Forage</p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--ink-dim)]">
            Filter what is available, compare a short list, and keep your best options close.
          </p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">&copy; {year} Film Forage by Shoaib (Aib) Syed.</p>
          {!compact ? (
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              Region-aware • Service checks • Local watchlist
            </p>
          ) : null}
        </div>

        <div className="grid content-start gap-3">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ink-dim)]">
            <Link href={("/" as Route)} className="hover:text-[var(--ink-main)]">Home</Link>
            <Link href={("/search" as Route)} className="hover:text-[var(--ink-main)]">Search</Link>
            <Link href={("/watchlist" as Route)} className="hover:text-[var(--ink-main)]">Watchlist</Link>
            <Link href={("/sources" as Route)} className="hover:text-[var(--ink-main)]">Data</Link>
          </div>
          {!compact ? (
            <>
              <p className="text-sm leading-7 text-[var(--ink-dim)]">
                Data comes from TMDB and JustWatch-backed provider availability through TMDB. If live data drops out, Film Forage clearly marks backup titles.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ink-dim)]">
                <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">TMDB</a>
                <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-main)]">JustWatch</a>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
