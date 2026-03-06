import { movieDetailResponseSchema } from "@/features/picker/contracts";
import { buildFitReasons } from "@/features/picker/fit-reasons";
import { getReserveCardById } from "@/lib/reserve/catalog";
import { requestTmdb, TmdbUnavailableError } from "@/lib/tmdb/client";
import { buildMovieCardBase } from "@/lib/tmdb/movie-card";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";
import { buildProviderSummary } from "@/lib/tmdb/provider-summary";
import {
  tmdbMovieCreditsSchema,
  tmdbMovieDetailSchema,
  tmdbMovieRecommendationsSchema,
  tmdbMovieVideosSchema,
  tmdbWatchProvidersSchema,
} from "@/lib/tmdb/schemas";

export async function getMovieDetail(id: number, region: string) {
  try {
    const [detail, providers, credits, videos, recommendations, similar] = await Promise.all([
      requestTmdb(`movie/${id}`, tmdbMovieDetailSchema, {
        params: { language: "en-US" },
        revalidate: 21600,
      }),
      requestTmdb(`movie/${id}/watch/providers`, tmdbWatchProvidersSchema, {
        revalidate: 21600,
      }),
      requestTmdb(`movie/${id}/credits`, tmdbMovieCreditsSchema, {
        revalidate: 21600,
      }),
      requestTmdb(`movie/${id}/videos`, tmdbMovieVideosSchema, {
        params: { language: "en-US" },
        revalidate: 21600,
      }),
      requestTmdb(`movie/${id}/recommendations`, tmdbMovieRecommendationsSchema, {
        params: { language: "en-US", page: 1 },
        revalidate: 21600,
      }),
      requestTmdb(`movie/${id}/similar`, tmdbMovieRecommendationsSchema, {
        params: { language: "en-US", page: 1 },
        revalidate: 21600,
      }),
    ]);

    const providerSummary = buildProviderSummary(region, providers.results[region]);
    const cardBase = {
      ...buildMovieCardBase(detail, providerSummary),
      backdropUrl: buildTmdbImageUrl(detail.backdrop_path, "original"),
    };

    const trailer = videos.results.find((video) => video.site === "YouTube" && (video.official || video.type === "Trailer"));
    const request = {
      region,
      providers: [],
      runtimeMax: detail.runtime ?? 240,
      genre: "any" as const,
      vibe: "any" as const,
      availabilityMode: "any" as const,
      excludeIds: [],
    };

    return movieDetailResponseSchema.parse({
      movie: {
        card: {
          ...cardBase,
          fitReasons: buildFitReasons(cardBase, request),
        },
        tagline: detail.tagline ?? undefined,
        releaseDate: detail.release_date || undefined,
        spokenLanguages: detail.spoken_languages
          .map((language) => language.english_name ?? language.name)
          .filter((language): language is string => Boolean(language)),
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined,
        cast: credits.cast
          .sort((left, right) => left.order - right.order)
          .slice(0, 6)
          .map((person) => ({ name: person.name, character: person.character ?? undefined })),
        recommendations: recommendations.results.slice(0, 6).map((movie) => ({
          id: movie.id,
          title: movie.title,
          year: Number(movie.release_date.slice(0, 4)) || 1970,
          posterUrl: buildTmdbImageUrl(movie.poster_path, "w300"),
        })),
        similar: similar.results.slice(0, 6).map((movie) => ({
          id: movie.id,
          title: movie.title,
          year: Number(movie.release_date.slice(0, 4)) || 1970,
          posterUrl: buildTmdbImageUrl(movie.poster_path, "w300"),
        })),
        provenanceNote: "Live movie facts, recommendations, and watch availability are fetched from TMDB for the selected region.",
        imdbUrl: detail.imdb_id ? `https://www.imdb.com/title/${detail.imdb_id}/` : undefined,
      },
      meta: {
        region,
        source: "live_tmdb",
      },
    });
  } catch (error) {
    if (error instanceof TmdbUnavailableError) {
      const reserveCard = getReserveCardById(id, region);
      if (!reserveCard) {
        throw error;
      }

      return movieDetailResponseSchema.parse({
        movie: {
          card: reserveCard,
          spokenLanguages: [],
          cast: [],
          recommendations: [],
          similar: [],
          provenanceNote: "Live movie detail is unavailable right now, so this page is showing a minimal reserve profile.",
        },
        meta: {
          region,
          source: "editorial_reserve",
        },
      });
    }

    throw error;
  }
}
