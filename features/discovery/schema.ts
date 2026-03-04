import { z } from "zod";

export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().int(),
  rating: z.number().min(0).max(10),
  runtimeMinutes: z.number().int().positive(),
  overview: z.string(),
  posterUrl: z.string().url(),
  mood: z.string(),
  genre: z.string(),
});

export const movieCollectionSchema = z.array(movieSchema);

export type Movie = z.infer<typeof movieSchema>;
