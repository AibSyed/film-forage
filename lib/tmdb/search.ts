import { searchResponseSchema, type SearchRequestVM } from "@/features/picker/contracts";
import { buildFitReasons } from "@/features/picker/fit-reasons";
import { searchReserveCards } from "@/lib/reserve/catalog";
import { requestTmdb, TmdbUnavailableError } from "@/lib/tmdb/client";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";
import {
  tmdbDiscoverResponseSchema,
  tmdbMovieDetailSchema,
  tmdbWatchProvidersSchema,
} from "@/lib/tmdb/schemas";

async function hydrateSearchCard(id: number, region: string) {
  const [detail, providers] = await Promise.all([
    requestTmdb(`movie/${id}`, tmdbMovieDetailSchema, {
      params: { language: "en-US" },
      revalidate: 21600,
      timeoutMs: 5000,
    }),
    requestTmdb(`movie/${id}/watch/providers`, tmdbWatchProvidersSchema, {
      revalidate: 21600,
      timeoutMs: 5000,
    }),
  ]);

  const regional = providers.results[region];
  const request = {
    region,
    providers: [],
    runtimeMax: 240,
    genre: "any" as const,
    vibe: "any" as const,
    availabilityMode: "any" as const,
    excludeIds: [],
  };

  const cardBase = {
    id: detail.id,
    title: detail.title,
    year: Number(detail.release_date.slice(0, 4)) || 1970,
    runtimeMinutes: detail.runtime,
    genres: detail.genres.map((genre) => genre.name).slice(0, 3),
    overview: detail.overview || "No overview available.",
    posterUrl: buildTmdbImageUrl(detail.poster_path, "w500"),
    backdropUrl: buildTmdbImageUrl(detail.backdrop_path, "w780"),
    providerSummary: {
      region,
      included: [...(regional?.flatrate ?? []), ...(regional?.free ?? []), ...(regional?.ads ?? [])].map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoUrl: buildTmdbImageUrl(provider.logo_path, "w300"),
      })),
      rent: (regional?.rent ?? []).map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoUrl: buildTmdbImageUrl(provider.logo_path, "w300"),
      })),
      buy: (regional?.buy ?? []).map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoUrl: buildTmdbImageUrl(provider.logo_path, "w300"),
      })),
      note: regional ? `Availability listed for ${region}` : `Availability is not listed for ${region}`,
      linkUrl: regional?.link,
      status: regional ? ("available" as const) : ("unknown" as const),
    },
    voteAverage: detail.vote_average,
    provenance: "live_tmdb" as const,
  };

  return {
    ...cardBase,
    fitReasons: buildFitReasons(cardBase, request),
  };
}

export async function searchMovies(request: SearchRequestVM) {
  try {
    const raw = await requestTmdb("search/movie", tmdbDiscoverResponseSchema, {
      params: {
        language: "en-US",
        query: request.query,
        include_adult: "false",
        page: 1,
      },
      revalidate: 900,
      timeoutMs: 5000,
    });

    const ids = raw.results.slice(0, 8).map((movie) => movie.id);
    const items = await Promise.all(ids.map((id) => hydrateSearchCard(id, request.region)));

    return searchResponseSchema.parse({
      query: request.query,
      items,
      meta: {
        region: request.region,
        source: "live_tmdb",
      },
    });
  } catch (error) {
    if (error instanceof TmdbUnavailableError) {
      return searchResponseSchema.parse({
        query: request.query,
        items: searchReserveCards(request.query, request.region),
        meta: {
          region: request.region,
          source: "editorial_reserve",
        },
      });
    }

    throw error;
  }
}
