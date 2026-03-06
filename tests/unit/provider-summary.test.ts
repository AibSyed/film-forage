import { describe, expect, it } from "vitest";
import { buildProviderSummary } from "@/lib/tmdb/provider-summary";

describe("buildProviderSummary", () => {
  it("builds included, rent, and buy provider buckets with a factual note", () => {
    const summary = buildProviderSummary("US", {
      link: "https://www.themoviedb.org/movie/550/watch?locale=US",
      flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: "/x.png", display_priority: 0 }],
      rent: [{ provider_id: 2, provider_name: "Apple TV", logo_path: "/y.png", display_priority: 1 }],
      buy: [],
      free: [],
      ads: [],
    });

    expect(summary.included[0]?.name).toBe("Netflix");
    expect(summary.rent[0]?.name).toBe("Apple TV");
    expect(summary.status).toBe("available");
    expect(summary.note).toContain("Netflix");
    expect(summary.note).toContain("US");
  });

  it("returns an unknown-status summary when no regional provider data exists", () => {
    const summary = buildProviderSummary("US", undefined);

    expect(summary.status).toBe("unknown");
    expect(summary.included).toEqual([]);
    expect(summary.note).toBe("Availability is not listed for US");
  });
});
