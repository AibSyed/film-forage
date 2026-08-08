import type { NextRequest } from "next/server";
import { regionSchema } from "@/features/picker/contracts";
import { getProviderCatalog } from "@/lib/tmdb/providers";
import { NO_STORE_HEADERS, SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";

export async function GET(request: NextRequest) {
  const parsed = regionSchema.safeParse(request.nextUrl.searchParams.get("region") ?? "US");

  if (!parsed.success) {
    return Response.json({ error: "invalid_payload", message: "Region must be a two-letter code." }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const payload = await getProviderCatalog(parsed.data);
  return Response.json(payload, { status: 200, headers: SAFE_GET_CACHE_HEADERS });
}
