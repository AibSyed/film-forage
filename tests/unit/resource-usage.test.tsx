import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";

describe("low-resource delivery", () => {
  it("disables deployment for every unspecified branch, including names with slashes", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8"));

    expect(config.git.deploymentEnabled).toEqual({
      "**": false,
      master: true,
      "release/**": true,
    });
  });

  it("keeps safe GET responses fresh briefly and reusable while revalidating", () => {
    expect(SAFE_GET_CACHE_HEADERS["Cache-Control"]).toBe(
      "public, s-maxage=900, stale-while-revalidate=86400",
    );
  });
});
