import type { DiscoveryQuery, MovieCard } from "@/features/discovery/schema";
import { curatedCatalog } from "@/features/discovery/catalog";

export async function fetchCuratedDiscovery(query: DiscoveryQuery): Promise<MovieCard[]> {
  const sorted = curatedCatalog
    .filter((item) => item.runtimeMinutes <= query.runtime)
    .map((item) => {
      const moodBoost = item.mood === query.mood ? 0.1 : 0;
      const genreBoost = item.genre === query.genre ? 0.1 : 0;
      return { ...item, confidence: Math.min(1, item.confidence + moodBoost + genreBoost) };
    })
    .sort((a, b) => b.confidence - a.confidence);

  return sorted.slice(0, 8);
}
