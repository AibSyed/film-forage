import Link from "next/link";
import { notFound } from "next/navigation";
import { curatedCatalog } from "@/features/discovery/catalog";

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = curatedCatalog.find((entry) => entry.id === id);

  if (!movie) {
    notFound();
  }

  return (
    <main id="main-content" className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <section className="overflow-hidden rounded-3xl border border-zinc-700 bg-black/40">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Title Briefing</p>
            <h1 className="mt-3 font-display text-6xl text-zinc-100 md:text-7xl">{movie.title}</h1>
            <p className="mt-4 max-w-2xl text-zinc-300">{movie.synopsis}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-zinc-300">
              <span className="rounded-full border border-zinc-600 px-3 py-1">{movie.year}</span>
              <span className="rounded-full border border-zinc-600 px-3 py-1">{movie.runtimeMinutes}m</span>
              <span className="rounded-full border border-zinc-600 px-3 py-1">{movie.genre}</span>
              <span className="rounded-full border border-zinc-600 px-3 py-1">confidence {(movie.confidence * 100).toFixed(0)}%</span>
              <span className="rounded-full border border-zinc-600 px-3 py-1">source {movie.source}</span>
            </div>
            <p className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4 text-amber-100">
              Curator rationale: {movie.reason}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-full border border-zinc-600 px-4 py-2 text-zinc-100 hover:border-zinc-400" href="/">
                Back to discovery
              </Link>
              <Link className="rounded-full border border-zinc-600 px-4 py-2 text-zinc-100 hover:border-zinc-400" href="/shortlist">
                Open shortlist
              </Link>
            </div>
          </div>
          <div className="relative min-h-[24rem] border-l border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
      <section className="mt-6 rounded-3xl border border-zinc-700 bg-zinc-950/70 p-6 md:p-8">
        <h2 className="font-display text-3xl text-zinc-100">Discovery Context</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          This title was normalized through the v3 contract path and is ready for shortlist ranking.
          If TMDB is unavailable, curated fallback still preserves this view model shape.
        </p>
        <p className="mt-3 text-sm text-zinc-400">Freshness budget: {movie.freshnessHours}h · mood lane: {movie.mood}</p>
      </section>
    </main>
  );
}
