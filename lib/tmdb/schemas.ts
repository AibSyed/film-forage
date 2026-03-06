import { z } from "zod";

const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const tmdbDiscoverMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().default("No overview available."),
  release_date: z.string().optional().default("1970-01-01"),
  poster_path: z.string().nullable().default(null),
  backdrop_path: z.string().nullable().default(null),
  genre_ids: z.array(z.number()).default([]),
  vote_average: z.number().nullable().default(null),
});

export const tmdbDiscoverResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbDiscoverMovieSchema),
  total_pages: z.number(),
});

const tmdbProviderEntrySchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable().default(null),
  display_priority: z.number().default(0),
});

export const tmdbWatchProvidersSchema = z.object({
  id: z.number(),
  results: z.record(
    z.string(),
    z.object({
      link: z.string().url().optional(),
      flatrate: z.array(tmdbProviderEntrySchema).optional(),
      rent: z.array(tmdbProviderEntrySchema).optional(),
      buy: z.array(tmdbProviderEntrySchema).optional(),
      free: z.array(tmdbProviderEntrySchema).optional(),
      ads: z.array(tmdbProviderEntrySchema).optional(),
    })
  ),
});

export const tmdbMovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().default("No overview available."),
  release_date: z.string().optional().default("1970-01-01"),
  runtime: z.number().nullable().default(null),
  poster_path: z.string().nullable().default(null),
  backdrop_path: z.string().nullable().default(null),
  vote_average: z.number().nullable().default(null),
  genres: z.array(tmdbGenreSchema).default([]),
  tagline: z.string().nullable().default(null),
  spoken_languages: z.array(z.object({ english_name: z.string().nullable().default(null), name: z.string().nullable().default(null) })).default([]),
  imdb_id: z.string().nullable().default(null),
});

export const tmdbMovieCreditsSchema = z.object({
  cast: z.array(z.object({ name: z.string(), character: z.string().nullable().default(null), order: z.number().default(999) })).default([]),
});

export const tmdbMovieVideosSchema = z.object({
  results: z.array(z.object({ site: z.string(), type: z.string(), key: z.string(), official: z.boolean().optional().default(false) })).default([]),
});

export const tmdbMovieRecommendationsSchema = z.object({
  results: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      release_date: z.string().optional().default("1970-01-01"),
      poster_path: z.string().nullable().default(null),
    })
  ).default([]),
});

export const tmdbProviderCatalogSchema = z.object({
  results: z.array(tmdbProviderEntrySchema),
});
