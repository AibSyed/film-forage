import { beforeEach, describe, expect, it, vi } from "vitest";

const requestTmdb = vi.fn();
const searchReserveCards = vi.fn();

class MockTmdbUnavailableError extends Error {}

vi.mock("@/lib/tmdb/client", () => ({
  requestTmdb,
  TmdbUnavailableError: MockTmdbUnavailableError,
}));

vi.mock("@/lib/reserve/catalog", () => ({
  searchReserveCards,
}));

const baseDetail = {
  id: 1,
  title: "Alpha",
  overview: "Alpha overview",
  release_date: "2023-01-01",
  runtime: 101,
  poster_path: "/alpha.jpg",
  backdrop_path: "/alpha-bg.jpg",
  vote_average: 7.4,
  genres: [{ id: 28, name: "Action" }],
  tagline: null,
  spoken_languages: [],
  imdb_id: null,
};

const baseProviders = {
  id: 1,
  results: {
    US: {
      link: "https://example.com/watch",
      flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: "/logo.png", display_priority: 1 }],
    },
  },
};

const reserveItem = {
  id: 999,
  title: "Reserve Pick",
  year: 2020,
  runtimeMinutes: 95,
  genres: ["Drama"],
  overview: "Reserve overview",
  providerSummary: {
    region: "US",
    included: [],
    rent: [],
    buy: [],
    note: "Availability is not listed for US",
    status: "unknown" as const,
  },
  fitReasons: ["Backup option"],
  voteAverage: null,
  provenance: "editorial_reserve" as const,
};

describe("searchMovies", () => {
  beforeEach(() => {
    requestTmdb.mockReset();
    searchReserveCards.mockReset();
    searchReserveCards.mockReturnValue([reserveItem]);
  });

  it("returns live results when at least one card hydrates", async () => {
    requestTmdb.mockImplementation(async (path: string) => {
      if (path === "search/movie") {
        return {
          page: 1,
          total_pages: 1,
          results: [
            { id: 1, title: "Alpha", overview: "x", release_date: "2023-01-01", poster_path: null, backdrop_path: null, genre_ids: [28], vote_average: 7.4 },
            { id: 2, title: "Beta", overview: "y", release_date: "2023-01-01", poster_path: null, backdrop_path: null, genre_ids: [28], vote_average: 6.1 },
          ],
        };
      }
      if (path === "movie/1") {
        return baseDetail;
      }
      if (path === "movie/1/watch/providers") {
        return baseProviders;
      }
      if (path === "movie/2" || path === "movie/2/watch/providers") {
        throw new MockTmdbUnavailableError("downstream error");
      }
      throw new Error(`Unexpected path ${path}`);
    });

    const { searchMovies } = await import("@/lib/tmdb/search");
    const result = await searchMovies({ query: "al", region: "US" });

    expect(result.meta.source).toBe("live_tmdb");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.title).toBe("Alpha");
    expect(searchReserveCards).not.toHaveBeenCalled();
  });

  it("falls back to reserve results when all hydrations fail", async () => {
    requestTmdb.mockImplementation(async (path: string) => {
      if (path === "search/movie") {
        return {
          page: 1,
          total_pages: 1,
          results: [{ id: 3, title: "Gamma", overview: "z", release_date: "2023-01-01", poster_path: null, backdrop_path: null, genre_ids: [28], vote_average: 5.4 }],
        };
      }
      if (path === "movie/3" || path === "movie/3/watch/providers") {
        throw new MockTmdbUnavailableError("movie unavailable");
      }
      throw new Error(`Unexpected path ${path}`);
    });

    const { searchMovies } = await import("@/lib/tmdb/search");
    const result = await searchMovies({ query: "ga", region: "US" });

    expect(result.meta.source).toBe("editorial_reserve");
    expect(result.items).toEqual([reserveItem]);
    expect(searchReserveCards).toHaveBeenCalledWith("ga", "US");
  });

  it("falls back to reserve results when hydrated cards fail schema validation", async () => {
    requestTmdb.mockImplementation(async (path: string) => {
      if (path === "search/movie") {
        return {
          page: 1,
          total_pages: 1,
          results: [{ id: 4, title: "Delta", overview: "q", release_date: "2023-01-01", poster_path: null, backdrop_path: null, genre_ids: [], vote_average: 5.8 }],
        };
      }
      if (path === "movie/4") {
        return {
          ...baseDetail,
          id: 4,
          title: "Delta",
          genres: [],
        };
      }
      if (path === "movie/4/watch/providers") {
        return baseProviders;
      }
      throw new Error(`Unexpected path ${path}`);
    });

    const { searchMovies } = await import("@/lib/tmdb/search");
    const result = await searchMovies({ query: "de", region: "US" });

    expect(result.meta.source).toBe("editorial_reserve");
    expect(result.items).toEqual([reserveItem]);
    expect(searchReserveCards).toHaveBeenCalledWith("de", "US");
  });
});
