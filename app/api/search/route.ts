import type { NextRequest } from "next/server";
import { searchRequestSchema } from "@/features/picker/contracts";
import { searchMovies } from "@/lib/tmdb/search";
import { NO_STORE_HEADERS, SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";

export async function GET(request: NextRequest) {
  const parsed = searchRequestSchema.safeParse({
    query: request.nextUrl.searchParams.get("q"),
    region: request.nextUrl.searchParams.get("region") ?? "US",
  });

  if (!parsed.success) {
    return Response.json({ error: "invalid_payload", message: "Search needs a query with at least two characters." }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const payload = await searchMovies(parsed.data);
  return Response.json(payload, { status: 200, headers: SAFE_GET_CACHE_HEADERS });
}
