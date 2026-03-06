import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { MovieDetail } from "@/components/movie/movie-detail";
import { getMovieDetail } from "@/lib/tmdb/movie-detail";
import { regionSchema } from "@/features/picker/contracts";

async function loadMovieDetail(id: number, region: string) {
  try {
    return await getMovieDetail(id, region);
  } catch {
    return null;
  }
}

export default async function MoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ region?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const region = regionSchema.safeParse(query.region ?? "US");
  const movieId = Number(id);

  if (!region.success || !Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  const detail = await loadMovieDetail(movieId, region.data);

  if (!detail) {
    return (
      <PageShell
        pathname="/movie"
        eyebrow="Movie detail"
        title="This title is not available right now."
        intro="The live movie detail fetch failed and there is no reserve profile for this id. Try the picker again or search a different title."
      >
        <div className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-white/92 p-8 text-sm text-[var(--ink-dim)]">
          <p>Try another title or go back to the tonight picker.</p>
          <div className="mt-4 flex gap-3">
            <Link href={"/" as Route} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">Back to tonight picker</Link>
            <Link href={"/search" as Route} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">Open title search</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      pathname="/movie"
      eyebrow="Movie detail"
      title={detail.movie.card.title}
      intro="One reliable page for the overview, the availability, and the next obvious movies to compare if this one misses."
    >
      <MovieDetail detail={detail} />
    </PageShell>
  );
}
