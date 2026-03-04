import { NextRequest } from "next/server";
import { discoveryQuerySchema } from "@/features/discovery/schema";
import { getDiscoveryFeed } from "@/lib/domain/discovery";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsedQuery = discoveryQuerySchema.safeParse(params);

  if (!parsedQuery.success) {
    return Response.json(
      {
        error: "invalid_payload",
        message: "Invalid query params. Expected mood, genre, runtime within supported ranges.",
      },
      { status: 400 }
    );
  }

  const query = parsedQuery.data;
  const result = await getDiscoveryFeed(query);

  return Response.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
