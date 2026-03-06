import { z } from "zod";

export const launchRegions = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IN", label: "India" },
] as const;

export const genreOptions = [
  { value: "any", label: "Any genre", genreIds: [] },
  { value: "action", label: "Action", genreIds: [28] },
  { value: "comedy", label: "Comedy", genreIds: [35] },
  { value: "drama", label: "Drama", genreIds: [18] },
  { value: "thriller", label: "Thriller", genreIds: [53] },
  { value: "sci-fi", label: "Sci-Fi", genreIds: [878] },
  { value: "animation", label: "Animation", genreIds: [16] },
  { value: "documentary", label: "Documentary", genreIds: [99] },
  { value: "horror", label: "Horror", genreIds: [27] },
] as const;

export const vibeOptions = [
  { value: "any", label: "Open to anything", genreIds: [], sortBy: "popularity.desc" },
  { value: "easygoing", label: "Easygoing night", genreIds: [35, 16, 10749, 10751], sortBy: "popularity.desc" },
  { value: "tense", label: "Keep it tense", genreIds: [53, 80, 9648, 27], sortBy: "vote_average.desc" },
  { value: "thoughtful", label: "Thoughtful watch", genreIds: [18, 878, 36, 99], sortBy: "vote_average.desc" },
  { value: "spectacle", label: "Big-screen energy", genreIds: [28, 12, 14, 878, 16], sortBy: "popularity.desc" },
] as const;

export const availabilityModes = [
  { value: "subscription", label: "Stream included" },
  { value: "rent_ok", label: "Rent is fine" },
  { value: "any", label: "Anything" },
] as const;

const genreValues = ["any", "action", "comedy", "drama", "thriller", "sci-fi", "animation", "documentary", "horror"] as const;
const vibeValues = ["any", "easygoing", "tense", "thoughtful", "spectacle"] as const;
const availabilityValues = ["subscription", "rent_ok", "any"] as const;

export const regionSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/)
  .default("US");

export const genreSchema = z.enum(genreValues).default("any");
const vibeSchema = z.enum(vibeValues).default("any");
const availabilityModeSchema = z.enum(availabilityValues).default("subscription");

const providerBadgeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

const providerSummarySchema = z.object({
  region: regionSchema,
  included: z.array(providerBadgeSchema),
  rent: z.array(providerBadgeSchema),
  buy: z.array(providerBadgeSchema),
  note: z.string().min(1),
  linkUrl: z.string().url().optional(),
  status: z.enum(["available", "unknown"]),
});

export const movieMatchCardSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  year: z.number().int().min(1888),
  runtimeMinutes: z.number().int().min(1).nullable(),
  genres: z.array(z.string().min(1)).min(1),
  overview: z.string().min(1),
  posterUrl: z.string().url().optional(),
  backdropUrl: z.string().url().optional(),
  providerSummary: providerSummarySchema,
  fitReasons: z.array(z.string().min(1)).min(1),
  voteAverage: z.number().min(0).max(10).nullable(),
  provenance: z.enum(["live_tmdb", "editorial_reserve"]),
});

export const pickRequestSchema = z.object({
  region: regionSchema,
  providers: z.array(z.number().int().positive()).max(12).default([]),
  runtimeMax: z.coerce.number().int().min(80).max(240).default(130),
  genre: genreSchema,
  vibe: vibeSchema,
  availabilityMode: availabilityModeSchema,
  excludeIds: z.array(z.number().int().positive()).max(100).default([]),
});

export const pickResponseSchema = z.object({
  bestMatch: movieMatchCardSchema.nullable(),
  backups: z.array(movieMatchCardSchema),
  alternateLane: z.array(movieMatchCardSchema),
  meta: z.object({
    region: regionSchema,
    source: z.enum(["live_tmdb", "editorial_reserve"]),
    requestedAt: z.string().datetime(),
    fallbackReason: z.enum(["tmdb_unavailable", "no_results"]).optional(),
  }),
});

const providerOptionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
  displayPriority: z.number().int().nonnegative(),
});

export const providerCatalogResponseSchema = z.object({
  region: regionSchema,
  providers: z.array(providerOptionSchema),
  source: z.enum(["live_tmdb", "unavailable"]),
});

export const searchRequestSchema = z.object({
  query: z.string().trim().min(2).max(80),
  region: regionSchema,
});

export const searchResponseSchema = z.object({
  query: z.string().min(2),
  items: z.array(movieMatchCardSchema),
  meta: z.object({
    region: regionSchema,
    source: z.enum(["live_tmdb", "editorial_reserve"]),
  }),
});

const movieReferenceSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  year: z.number().int().min(1888),
  posterUrl: z.string().url().optional(),
});

const movieDetailSchema = z.object({
  card: movieMatchCardSchema,
  tagline: z.string().min(1).optional(),
  releaseDate: z.string().min(4).optional(),
  spokenLanguages: z.array(z.string().min(1)),
  trailerUrl: z.string().url().optional(),
  cast: z.array(z.object({ name: z.string().min(1), character: z.string().min(1).optional() })).max(8),
  recommendations: z.array(movieReferenceSchema),
  similar: z.array(movieReferenceSchema),
  provenanceNote: z.string().min(1),
  tmdbUrl: z.string().url().optional(),
});

export const movieDetailResponseSchema = z.object({
  movie: movieDetailSchema,
  meta: z.object({
    region: regionSchema,
    source: z.enum(["live_tmdb", "editorial_reserve"]),
  }),
});

export type PickRequestVM = z.infer<typeof pickRequestSchema>;
export type PickResponseVM = z.infer<typeof pickResponseSchema>;
export type MovieMatchCardVM = z.infer<typeof movieMatchCardSchema>;
export type ProviderCatalogResponseVM = z.infer<typeof providerCatalogResponseSchema>;
export type SearchRequestVM = z.infer<typeof searchRequestSchema>;
export type SearchResponseVM = z.infer<typeof searchResponseSchema>;
export type MovieDetailResponseVM = z.infer<typeof movieDetailResponseSchema>;

export function getGenreLabel(value: z.infer<typeof genreSchema>) {
  return genreOptions.find((option) => option.value === value)?.label ?? "Any genre";
}
