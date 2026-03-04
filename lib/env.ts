import { z } from "zod";

const envSchema = z.object({
  TMDB_API_KEY: z.string().min(1).optional(),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
});

export const env = envSchema.parse({
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
});
