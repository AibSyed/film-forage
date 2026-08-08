import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getMovieDetail } = vi.hoisted(() => ({
  getMovieDetail: vi.fn(async (_id: number, region: string) => ({
    movie: { card: { id: 550, title: "Fight Club" } },
    meta: { region, source: "live_tmdb" },
  })),
}));

vi.mock("@/lib/tmdb/movie-detail", () => ({ getMovieDetail }));

import { GET } from "@/app/api/movie/[id]/route";

function request(id: string, region?: string) {
  const url = new URL(`http://localhost/api/movie/${id}`);
  if (region !== undefined) url.searchParams.set("region", region);

  return GET(new NextRequest(url), { params: Promise.resolve({ id }) });
}

describe("GET /api/movie/[id]", () => {
  beforeEach(() => {
    getMovieDetail.mockClear();
  });

  it.each(["0", "-1", "1.5", "abc", "0x10", "9007199254740992"])(
    "rejects the noncanonical movie id %s before fetching",
    async (id) => {
      const response = await request(id);

      expect(response.status).toBe(400);
      expect(response.headers.get("Cache-Control")).toContain("no-store");
      expect(getMovieDetail).not.toHaveBeenCalled();
    },
  );

  it("rejects an invalid region before fetching", async () => {
    const response = await request("550", "USA");

    expect(response.status).toBe(400);
    expect(getMovieDetail).not.toHaveBeenCalled();
  });

  it("normalizes a valid region and returns a shared-cacheable response", async () => {
    const response = await request("550", " gb ");

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=900, stale-while-revalidate=86400",
    );
    expect(getMovieDetail).toHaveBeenCalledWith(550, "GB");
  });
});
