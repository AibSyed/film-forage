import { searchResponseSchema, type SearchRequestVM } from "@/features/picker/contracts";
import { buildFitReasons } from "@/features/picker/fit-reasons";
import { searchReserveCards } from "@/lib/reserve/catalog";
import { requestTmdb, TmdbUnavailableError } from "@/lib/tmdb/client";
import { buildMovieCardBase } from "@/lib/tmdb/movie-card";
import { buildProviderSummary } from "@/lib/tmdb/provider-summary";
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

  const request = {
    region,
    providers: [],
    runtimeMax: 240,
    genre: "any" as const,
    vibe: "any" as const,
    availabilityMode: "any" as const,
    excludeIds: [],
  };

  const providerSummary = buildProviderSummary(region, providers.results[region]);
  const cardBase = buildMovieCardBase(detail, providerSummary);

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
    const hydrated = await Promise.allSettled(ids.map((id) => hydrateSearchCard(id, request.region)));
    const items = hydrated
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof hydrateSearchCard>>> => result.status === "fulfilled")
      .map((result) => result.value);

    if (items.length === 0 && ids.length > 0) {
      return searchResponseSchema.parse({
        query: request.query,
        items: searchReserveCards(request.query, request.region),
        meta: {
          region: request.region,
          source: "editorial_reserve",
        },
      });
    }

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
