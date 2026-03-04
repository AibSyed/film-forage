import { z } from "zod";

export const moodSchema = z.enum(["atmospheric", "adrenaline", "reflective", "playful"]);
export const genreSchema = z.enum(["sci-fi", "drama", "thriller", "animation", "action"]);

export const discoveryQuerySchema = z.object({
  mood: moodSchema.default("atmospheric"),
  genre: genreSchema.default("sci-fi"),
  runtime: z.coerce.number().int().min(75).max(220).default(145),
});

export const movieCardSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  year: z.number().int(),
  runtimeMinutes: z.number().int(),
  rating: z.number().min(0).max(10),
  genre: genreSchema,
  mood: moodSchema,
  confidence: z.number().min(0).max(1),
  freshnessHours: z.number().min(0),
  synopsis: z.string().min(1),
  posterUrl: z.string().url(),
  backdropUrl: z.string().url().optional(),
  reason: z.string().min(1),
  source: z.enum(["tmdb", "curated"]),
});

export const discoveryResponseSchema = z.object({
  items: z.array(movieCardSchema),
  meta: z.object({
    source: z.enum(["tmdb", "curated"]),
    fallbackUsed: z.boolean(),
    confidence: z.number().min(0).max(1),
    freshnessHours: z.number().min(0),
    partialData: z.boolean(),
    generatedAt: z.string(),
  }),
});

export type DiscoveryQuery = z.infer<typeof discoveryQuerySchema>;
export type MovieCard = z.infer<typeof movieCardSchema>;
export type DiscoveryResponse = z.infer<typeof discoveryResponseSchema>;
