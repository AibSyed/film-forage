import { z } from "zod";

const envSchema = z.object({
  TMDB_ACCESS_TOKEN: z.string().min(1).optional(),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
});

export const env = envSchema.parse({
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
});
