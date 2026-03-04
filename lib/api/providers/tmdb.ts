import { z } from "zod";
import type { DiscoveryQuery, MovieCard } from "@/features/discovery/schema";

const tmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  release_date: z.string().optional().default("1970-01-01"),
  vote_average: z.number().default(0),
  poster_path: z.string().nullable().default(null),
  backdrop_path: z.string().nullable().default(null),
  genre_ids: z.array(z.number()).default([]),
});

const tmdbResponseSchema = z.object({
  results: z.array(tmdbMovieSchema),
});

const genreMap: Record<DiscoveryQuery["genre"], number> = {
  "sci-fi": 878,
  drama: 18,
  thriller: 53,
  animation: 16,
  action: 28,
};

function mapMoodToVoteFloor(mood: DiscoveryQuery["mood"]) {
  if (mood === "adrenaline") {
    return 6.8;
  }
  if (mood === "reflective") {
    return 7.1;
  }
  return 6.5;
}

function ensureEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export async function fetchTmdbDiscovery(query: DiscoveryQuery): Promise<MovieCard[]> {
  const token = ensureEnv("TMDB_ACCESS_TOKEN");
  const baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

  const search = new URLSearchParams({
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: "1",
    sort_by: "popularity.desc",
    with_genres: String(genreMap[query.genre]),
    "vote_average.gte": String(mapMoodToVoteFloor(query.mood)),
    "with_runtime.lte": String(query.runtime),
    "vote_count.gte": "200",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(`${baseUrl}/discover/movie?${search.toString()}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`TMDB request failed with status ${response.status}`);
    }

    const parsed = tmdbResponseSchema.parse(await response.json());

    return parsed.results.slice(0, 8).map((movie) => ({
      id: String(movie.id),
      title: movie.title,
      year: Number(movie.release_date.slice(0, 4)) || 1970,
      runtimeMinutes: query.runtime,
      rating: Number(movie.vote_average.toFixed(1)),
      genre: query.genre,
      mood: query.mood,
      confidence: 0.86,
      freshnessHours: 4,
      synopsis: movie.overview || "No synopsis available.",
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80",
      backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined,
      reason: "Matched to your selected mood, genre, and runtime window.",
      source: "tmdb",
    }));
  } finally {
    clearTimeout(timeout);
  }
}
