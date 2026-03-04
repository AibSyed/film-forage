import { fallbackMovies } from "@/features/discovery/fallback";
import { movieCollectionSchema, type Movie } from "@/features/discovery/schema";
import { env } from "@/lib/env";
import { fetchWithTimeout } from "@/lib/http";
import { logError, logInfo } from "@/lib/logger";

type Query = { mood?: string; genre?: string; maxRuntime?: number };

type TmdbMovie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string | null;
  genre_ids?: number[];
};

const genreMap: Record<string, number> = {
  action: 28,
  comedy: 35,
  drama: 18,
  animation: 16,
  "sci-fi": 878,
};

function normalizeTmdbMovie(movie: TmdbMovie, mood: string, genre: string): Movie | null {
  if (!movie.poster_path || !movie.title) {
    return null;
  }

  const year = Number(movie.release_date?.slice(0, 4) ?? 2020);
  return {
    id: String(movie.id),
    title: movie.title,
    year: Number.isNaN(year) ? 2020 : year,
    rating: Math.max(0, Math.min(10, Number(movie.vote_average ?? 0))),
    runtimeMinutes: 120,
    overview: movie.overview ?? "No synopsis available.",
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    mood,
    genre,
  };
}

export async function getDiscoveryMovies(query: Query): Promise<Movie[]> {
  const mood = query.mood ?? "atmospheric";
  const genre = query.genre ?? "sci-fi";

  if (!env.TMDB_API_KEY) {
    logInfo("TMDB key missing, serving curated fallback discovery set");
    return fallbackMovies.filter((movie) => movie.genre === genre || genre === "all");
  }

  try {
    const genreId = genreMap[genre] ?? 878;
    const response = await fetchWithTimeout(
      `${env.TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=400`,
      {},
      7000,
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed with ${response.status}`);
    }

    const payload = (await response.json()) as { results?: TmdbMovie[] };
    const normalized = (payload.results ?? []).map((movie) => normalizeTmdbMovie(movie, mood, genre)).filter(Boolean);

    const parsed = movieCollectionSchema.safeParse(normalized);
    if (!parsed.success || parsed.data.length === 0) {
      throw new Error("TMDB payload failed schema parsing");
    }

    const runtimeFilter = query.maxRuntime;
    if (!runtimeFilter) {
      return parsed.data.slice(0, 8);
    }

    return parsed.data.filter((movie) => movie.runtimeMinutes <= runtimeFilter).slice(0, 8);
  } catch (error) {
    logError("TMDB adapter failed, falling back to curated set", error);
    return fallbackMovies.filter((movie) => movie.genre === genre || genre === "all");
  }
}
