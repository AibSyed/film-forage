import type { NextRequest } from "next/server";
import { movieIdParamSchema, regionSchema } from "@/features/picker/contracts";
import { getMovieDetail } from "@/lib/tmdb/movie-detail";
import { NO_STORE_HEADERS, SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = movieIdParamSchema.safeParse(id);
  const region = regionSchema.safeParse(request.nextUrl.searchParams.get("region") ?? "US");

  if (!movieId.success || !region.success) {
    return Response.json(
      { error: "invalid_payload", message: "Movie id and region must be valid." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const payload = await getMovieDetail(movieId.data, region.data);
    return Response.json(payload, { status: 200, headers: SAFE_GET_CACHE_HEADERS });
  } catch {
    return Response.json({ error: "not_found", message: "Movie detail is unavailable." }, { status: 404, headers: NO_STORE_HEADERS });
  }
}
