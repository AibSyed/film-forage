import { describe, expect, it } from "vitest";
import { buildFitReasons } from "@/features/picker/fit-reasons";
import type { PickRequestVM } from "@/features/picker/contracts";

const request: PickRequestVM = {
  region: "US",
  providers: [8],
  runtimeMax: 120,
  genre: "thriller",
  vibe: "tense",
  availabilityMode: "subscription",
  excludeIds: [],
};

describe("buildFitReasons", () => {
  it("uses explicit runtime, provider, and genre facts", () => {
    const reasons = buildFitReasons(
      {
        id: 1,
        title: "Test Movie",
        year: 2020,
        runtimeMinutes: 110,
        genres: ["Thriller", "Drama"],
        overview: "Overview",
        providerSummary: {
          region: "US",
          included: [{ id: 8, name: "Netflix" }],
          rent: [],
          buy: [],
          note: "Included with Netflix in US",
          status: "available",
        },
        voteAverage: 7.8,
        provenance: "live_tmdb",
      },
      request
    );

    expect(reasons).toContain("Under 120 min");
    expect(reasons).toContain("Streaming on Netflix in US");
    expect(reasons).toContain("Matches Thriller");
  });

  it("falls back to a factual release-year reason instead of invented rationale", () => {
    const reasons = buildFitReasons(
      {
        id: 2,
        title: "Another Test",
        year: 1999,
        runtimeMinutes: null,
        genres: ["Mystery"],
        overview: "Overview",
        providerSummary: {
          region: "US",
          included: [],
          rent: [],
          buy: [],
          note: "Availability unknown",
          status: "unknown",
        },
        voteAverage: null,
        provenance: "editorial_reserve",
      },
      { ...request, providers: [], genre: "any" }
    );

    expect(reasons).toEqual(["Released in 1999"]);
  });
});
