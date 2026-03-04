import { discoveryResponseSchema, type DiscoveryQuery, type DiscoveryResponse } from "@/features/discovery/schema";
import { fetchCuratedDiscovery } from "@/lib/api/providers/fallback";
import { fetchTmdbDiscovery } from "@/lib/api/providers/tmdb";

export async function getDiscoveryFeed(query: DiscoveryQuery): Promise<DiscoveryResponse> {
  try {
    const items = await fetchTmdbDiscovery(query);
    return discoveryResponseSchema.parse({
      items,
      meta: {
        source: "tmdb",
        fallbackUsed: false,
        confidence: 0.86,
        freshnessHours: 4,
        partialData: false,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch {
    const items = await fetchCuratedDiscovery(query);
    return discoveryResponseSchema.parse({
      items,
      meta: {
        source: "curated",
        fallbackUsed: true,
        confidence: 0.73,
        freshnessHours: 48,
        partialData: false,
        generatedAt: new Date().toISOString(),
      },
    });
  }
}
