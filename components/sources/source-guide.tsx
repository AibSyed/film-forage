export function SourceGuide() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface-1)] p-6 shadow-[0_18px_52px_rgba(8,12,20,0.12)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-faint)]">Sources</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.94] text-[var(--ink-strong)] md:text-6xl">What Film Forage knows, and what it does not.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--ink-soft)]">
          Film Forage uses TMDB for movie metadata and JustWatch-backed watch-provider availability surfaced through TMDB. Saved picks, dismissed movies, notes, and search history stay local in your browser.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 shadow-[0_18px_52px_rgba(8,12,20,0.12)]">
          <h2 className="font-display text-3xl text-[var(--ink-strong)]">Live data</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>Movie metadata, search results, recommendations, similar titles, and watch-provider availability come from TMDB.</li>
            <li>Watch-provider availability can vary by region and may be missing or delayed.</li>
            <li>Film Forage does not guess hidden service availability when TMDB omits it.</li>
          </ul>
        </article>
        <article className="rounded-[1.75rem] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 shadow-[0_18px_52px_rgba(8,12,20,0.12)]">
          <h2 className="font-display text-3xl text-[var(--ink-strong)]">Reserve shelf</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>If live TMDB data is unavailable, Film Forage falls back to a small reserve shelf so you still have credible options to compare.</li>
            <li>Reserve picks are clearly labeled and do not claim current service availability.</li>
            <li>The reserve shelf is a backup, not the primary source of truth.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 shadow-[0_18px_52px_rgba(8,12,20,0.12)]">
        <h2 className="font-display text-3xl text-[var(--ink-strong)]">Attribution</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          This product uses the TMDB API but is not endorsed or certified by TMDB. Watch-provider availability originates from JustWatch data surfaced by TMDB. Use provider links as a starting point and verify availability in the target app before you press play.
        </p>
      </section>
    </div>
  );
}
