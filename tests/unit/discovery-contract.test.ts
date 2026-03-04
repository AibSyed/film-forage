import { afterEach, describe, expect, it, vi } from "vitest";
import { discoveryResponseSchema, type DiscoveryQuery } from "@/features/discovery/schema";
import { getDiscoveryFeed } from "@/lib/domain/discovery";

vi.mock("@/lib/api/providers/tmdb", () => ({
  fetchTmdbDiscovery: vi.fn(),
}));

import { fetchTmdbDiscovery } from "@/lib/api/providers/tmdb";

describe("discovery contracts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns valid normalized payload", async () => {
    vi.mocked(fetchTmdbDiscovery).mockRejectedValue(new Error("provider unavailable"));

    const query: DiscoveryQuery = {
      mood: "reflective",
      genre: "sci-fi",
      runtime: 170,
    };

    const payload = await getDiscoveryFeed(query);
    const parsed = discoveryResponseSchema.parse(payload);

    expect(parsed.items.length).toBeGreaterThan(0);
    expect(parsed.meta.source).toBe("curated");
    expect(parsed.meta.fallbackUsed).toBe(true);
  });

  it("uses live source when provider succeeds", async () => {
    vi.mocked(fetchTmdbDiscovery).mockResolvedValue([
      {
        id: "live-1",
        title: "Live Film",
        year: 2020,
        runtimeMinutes: 120,
        rating: 7.8,
        genre: "sci-fi",
        mood: "reflective",
        confidence: 0.88,
        freshnessHours: 4,
        synopsis: "Live source test payload",
        posterUrl: "https://images.example.com/poster.jpg",
        backdropUrl: "https://images.example.com/backdrop.jpg",
        reason: "Provider success path",
        source: "tmdb",
      },
    ]);

    const payload = await getDiscoveryFeed({ mood: "reflective", genre: "sci-fi", runtime: 170 });
    const parsed = discoveryResponseSchema.parse(payload);

    expect(parsed.meta.source).toBe("tmdb");
    expect(parsed.meta.fallbackUsed).toBe(false);
    expect(parsed.items[0]?.title).toBe("Live Film");
  });
});
