import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTmdbAuth } from "@/lib/tmdb/client";

describe("resolveTmdbAuth", () => {
  const originalAccessToken = process.env.TMDB_ACCESS_TOKEN;
  const originalApiKey = process.env.TMDB_API_KEY;

  afterEach(() => {
    if (originalAccessToken === undefined) {
      delete process.env.TMDB_ACCESS_TOKEN;
    } else {
      process.env.TMDB_ACCESS_TOKEN = originalAccessToken;
    }

    if (originalApiKey === undefined) {
      delete process.env.TMDB_API_KEY;
    } else {
      process.env.TMDB_API_KEY = originalApiKey;
    }

    vi.restoreAllMocks();
  });

  it("treats a 32-character legacy TMDB key as an api_key credential", () => {
    process.env.TMDB_ACCESS_TOKEN = "e0d0d61a05032e0b098ce502912c6e6c";
    delete process.env.TMDB_API_KEY;

    expect(resolveTmdbAuth()).toEqual({
      kind: "api_key",
      value: "e0d0d61a05032e0b098ce502912c6e6c",
    });
  });

  it("prefers a dedicated TMDB_API_KEY when a bearer token is not present", () => {
    process.env.TMDB_ACCESS_TOKEN = "";
    process.env.TMDB_API_KEY = "legacy-v3-key";

    expect(resolveTmdbAuth()).toEqual({
      kind: "api_key",
      value: "legacy-v3-key",
    });
  });

  it("uses bearer auth for non-legacy tokens", () => {
    process.env.TMDB_ACCESS_TOKEN = "tmdb-v4-read-token";
    delete process.env.TMDB_API_KEY;

    expect(resolveTmdbAuth()).toEqual({
      kind: "bearer",
      value: "tmdb-v4-read-token",
    });
  });
});
