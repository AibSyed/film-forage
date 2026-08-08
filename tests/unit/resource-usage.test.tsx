import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TmdbImage } from "@/components/movie/tmdb-image";
import { SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";

describe("low-resource delivery", () => {
  it("disables deployment for every unspecified branch, including names with slashes", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8"));

    expect(config.git.deploymentEnabled).toEqual({
      "**": false,
      master: true,
      "release/**": true,
    });
  });

  it("renders TMDB media directly instead of through Vercel image optimization", () => {
    const source = buildTmdbImageUrl("/poster.jpg", "w500");
    const markup = renderToStaticMarkup(
      <TmdbImage src={source ?? ""} alt="Example poster" width={500} height={750} />,
    );

    expect(markup).toContain("https://image.tmdb.org/t/p/w500/poster.jpg");
    expect(markup).not.toContain("/_next/image");
  });

  it("retains normal Next.js optimization for non-TMDB media", () => {
    const markup = renderToStaticMarkup(
      <TmdbImage src="/local-poster.jpg" alt="Local poster" width={500} height={750} />,
    );

    expect(markup).toContain("/_next/image");
  });

  it("keeps safe GET responses fresh briefly and reusable while revalidating", () => {
    expect(SAFE_GET_CACHE_HEADERS["Cache-Control"]).toBe(
      "public, s-maxage=900, stale-while-revalidate=86400",
    );
  });
});
