import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveCollection } from "@/features/discovery/collections";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = resolveCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main id="main-content" className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <section className="rounded-3xl border border-zinc-700 bg-black/40 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Editorial Collection</p>
        <h1 className="mt-3 font-display text-6xl text-zinc-100 md:text-7xl">{collection.title}</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">{collection.description}</p>
        <p className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4 text-amber-100">{collection.curatorNote}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full border border-zinc-600 px-4 py-2 text-zinc-100 hover:border-zinc-400" href="/">Back to discovery</Link>
          <Link className="rounded-full border border-zinc-600 px-4 py-2 text-zinc-100 hover:border-zinc-400" href="/shortlist">Open shortlist</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {collection.items.map((movie) => (
          <article key={movie.id} className="rounded-3xl border border-zinc-700 bg-zinc-950/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200">{movie.mood} lane · {movie.genre}</p>
            <h2 className="mt-2 font-display text-3xl text-zinc-100">{movie.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{movie.year} · {movie.runtimeMinutes}m · confidence {(movie.confidence * 100).toFixed(0)}%</p>
            <p className="mt-3 text-zinc-300">{movie.synopsis}</p>
            <Link className="mt-4 inline-flex rounded-full border border-zinc-600 px-3 py-1 text-sm text-zinc-100 hover:border-zinc-400" href={`/title/${movie.id}`}>
              Open title briefing
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
