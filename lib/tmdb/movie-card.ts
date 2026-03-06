import type { MovieMatchCardVM, ProviderSummaryVM } from "@/features/picker/contracts";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";
import type { TmdbMovieDetail } from "@/lib/tmdb/schemas";

export function buildMovieCardBase(
  detail: TmdbMovieDetail,
  providerSummary: ProviderSummaryVM
): Omit<MovieMatchCardVM, "fitReasons"> {
  return {
    id: detail.id,
    title: detail.title,
    year: Number(detail.release_date.slice(0, 4)) || 1970,
    runtimeMinutes: detail.runtime,
    genres: detail.genres.map((genre) => genre.name).slice(0, 3),
    overview: detail.overview || "No overview available.",
    posterUrl: buildTmdbImageUrl(detail.poster_path, "w500"),
    backdropUrl: buildTmdbImageUrl(detail.backdrop_path, "w780"),
    providerSummary,
    voteAverage: detail.vote_average,
    provenance: "live_tmdb",
  };
}
