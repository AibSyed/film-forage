import {
  pickResponseSchema,
  type MovieMatchCardVM,
  type PickRequestVM,
} from "@/features/picker/contracts";
import { buildFitReasons } from "@/features/picker/fit-reasons";
import { getReserveCards } from "@/lib/reserve/catalog";
import { requestTmdb, TmdbUnavailableError } from "@/lib/tmdb/client";
import { buildMovieCardBase } from "@/lib/tmdb/movie-card";
import { buildProviderSummary } from "@/lib/tmdb/provider-summary";
import {
  tmdbDiscoverResponseSchema,
  tmdbMovieDetailSchema,
  tmdbWatchProvidersSchema,
} from "@/lib/tmdb/schemas";

const genreIdToName: Record<number, string> = {
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  53: "Thriller",
  80: "Crime",
  878: "Sci-Fi",
  9648: "Mystery",
  99: "Documentary",
  12: "Adventure",
  14: "Fantasy",
  36: "History",
  10749: "Romance",
  10751: "Family",
};

const vibeProfiles = {
  any: { genreIds: [], sortBy: "popularity.desc" },
  easygoing: { genreIds: [35, 16, 10749, 10751], sortBy: "popularity.desc" },
  tense: { genreIds: [53, 80, 9648, 27], sortBy: "vote_average.desc" },
  thoughtful: { genreIds: [18, 878, 36, 99], sortBy: "vote_average.desc" },
  spectacle: { genreIds: [28, 12, 14, 878, 16], sortBy: "popularity.desc" },
} as const satisfies Record<PickRequestVM["vibe"], { genreIds: readonly number[]; sortBy: string }>;

const explicitGenreMap = {
  any: [],
  action: [28],
  comedy: [35],
  drama: [18],
  thriller: [53],
  "sci-fi": [878],
  animation: [16],
  documentary: [99],
  horror: [27],
} as const satisfies Record<PickRequestVM["genre"], readonly number[]>;

function monetizationTypes(mode: PickRequestVM["availabilityMode"]) {
  if (mode === "subscription") {
    return "flatrate|free|ads";
  }
  if (mode === "rent_ok") {
    return "flatrate|free|ads|rent";
  }
  return undefined;
}

function genreFilter(request: PickRequestVM) {
  const explicit = explicitGenreMap[request.genre];
  if (explicit.length > 0) {
    return explicit.join(",");
  }

  const vibe = vibeProfiles[request.vibe];
  return vibe.genreIds.length > 0 ? vibe.genreIds.join(",") : undefined;
}

async function hydrateMovie(id: number, request: PickRequestVM): Promise<MovieMatchCardVM> {
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

  const providerSummary = buildProviderSummary(request.region, providers.results[request.region]);
  const cardBase = buildMovieCardBase(detail, providerSummary);

  return {
    ...cardBase,
    fitReasons: buildFitReasons(cardBase, request),
  };
}

async function discoverCandidates(request: PickRequestVM, loosen = false) {
  const params: Record<string, string | number | undefined> = {
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: 1,
    region: request.region,
    sort_by: loosen ? "popularity.desc" : vibeProfiles[request.vibe].sortBy,
    "vote_count.gte": 250,
    "with_runtime.lte": request.runtimeMax,
    with_genres: loosen ? undefined : genreFilter(request),
    watch_region: request.region,
    with_watch_monetization_types: loosen ? undefined : monetizationTypes(request.availabilityMode),
    with_watch_providers: !loosen && request.providers.length > 0 ? request.providers.join("|") : undefined,
  };

  const pageOne = await requestTmdb("discover/movie", tmdbDiscoverResponseSchema, {
    params,
    revalidate: 1800,
    timeoutMs: 5000,
  });

  const maybePageTwo = pageOne.results.length < 8 && pageOne.total_pages > 1
    ? await requestTmdb("discover/movie", tmdbDiscoverResponseSchema, {
        params: { ...params, page: 2 },
        revalidate: 1800,
        timeoutMs: 5000,
      })
    : null;

  const items = [...pageOne.results, ...(maybePageTwo?.results ?? [])]
    .filter((movie) => !request.excludeIds.includes(movie.id))
    .slice(0, 8);

  return items.map((movie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    year: Number(movie.release_date.slice(0, 4)) || 1970,
    genres: movie.genre_ids.map((genreId) => genreIdToName[genreId]).filter((genre): genre is string => Boolean(genre)),
  }));
}

export async function pickMovies(request: PickRequestVM) {
  try {
    const primaryCandidates = await discoverCandidates(request);
    if (primaryCandidates.length === 0) {
      const reserve = getReserveCards(request);
      return pickResponseSchema.parse({
        bestMatch: reserve[0] ?? null,
        backups: reserve.slice(1, 4),
        alternateLane: [],
        meta: {
          region: request.region,
          source: "editorial_reserve",
          requestedAt: new Date().toISOString(),
          fallbackReason: "no_results",
        },
      });
    }

    const hydrated = await Promise.all(primaryCandidates.slice(0, 5).map((candidate) => hydrateMovie(candidate.id, request)));

    const alternateCandidates = hydrated.length < 4 ? await discoverCandidates(request, true) : [];
    const dedupedAlternate = alternateCandidates.filter((candidate) => !hydrated.some((movie) => movie.id === candidate.id));
    const alternateLane = dedupedAlternate.length > 0
      ? await Promise.all(dedupedAlternate.slice(0, 3).map((candidate) => hydrateMovie(candidate.id, {
          ...request,
          providers: [],
          availabilityMode: "any",
        })))
      : [];

    return pickResponseSchema.parse({
      bestMatch: hydrated[0] ?? null,
      backups: hydrated.slice(1),
      alternateLane,
      meta: {
        region: request.region,
        source: "live_tmdb",
        requestedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof TmdbUnavailableError) {
      const reserve = getReserveCards(request);
      return pickResponseSchema.parse({
        bestMatch: reserve[0] ?? null,
        backups: reserve.slice(1, 4),
        alternateLane: [],
        meta: {
          region: request.region,
          source: "editorial_reserve",
          requestedAt: new Date().toISOString(),
          fallbackReason: "tmdb_unavailable",
        },
      });
    }

    throw error;
  }
}
