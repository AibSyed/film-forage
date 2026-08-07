import type { NextRequest } from "next/server";
import { getMovieDetail } from "@/lib/tmdb/movie-detail";
import { NO_STORE_HEADERS, SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const region = request.nextUrl.searchParams.get("region") ?? "US";

  if (!Number.isFinite(numericId)) {
    return Response.json({ error: "invalid_payload", message: "Movie id must be numeric." }, { status: 400, headers: NO_STORE_HEADERS });
  }

  try {
    const payload = await getMovieDetail(numericId, region);
    return Response.json(payload, { status: 200, headers: SAFE_GET_CACHE_HEADERS });
  } catch {
    return Response.json({ error: "not_found", message: "Movie detail is unavailable." }, { status: 404, headers: NO_STORE_HEADERS });
  }
}
