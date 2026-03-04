import { getDiscoveryMovies } from "@/lib/api/tmdb";
import { z } from "zod";

const querySchema = z.object({
  mood: z.string().optional(),
  genre: z.string().optional(),
  runtime: z.coerce.number().int().positive().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return Response.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
  }

  const movies = await getDiscoveryMovies({
    mood: parsed.data.mood,
    genre: parsed.data.genre,
    maxRuntime: parsed.data.runtime,
  });

  return Response.json({ items: movies, source: process.env.TMDB_ACCESS_TOKEN ? "tmdb" : "fallback" }, { status: 200 });
}
