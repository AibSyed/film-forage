import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tmdb/picker", () => ({
  pickTonight: vi.fn(async () => ({
    bestMatch: null,
    backups: [],
    alternateLane: [],
    meta: {
      region: "US",
      source: "editorial_reserve",
      requestedAt: new Date().toISOString(),
      fallbackReason: "tmdb_unavailable",
    },
  })),
}));

import { POST } from "@/app/api/pick/route";

describe("POST /api/pick", () => {
  it("rejects invalid payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runtimeMax: 20 }),
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns a normalized picker payload for valid requests", async () => {
    const response = await POST(
      new Request("http://localhost/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: "US", providers: [], runtimeMax: 130, genre: "any", vibe: "any", availabilityMode: "subscription", excludeIds: [] }),
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.meta.source).toBe("editorial_reserve");
  });
});
