import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TmdbImage } from "@/components/movie/tmdb-image";
import { SAFE_GET_CACHE_HEADERS } from "@/lib/http/cache";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";

describe("low-resource delivery", () => {
  it("renders TMDB media directly instead of through Vercel image optimization", () => {
    const source = buildTmdbImageUrl("/poster.jpg", "w500");
    const markup = renderToStaticMarkup(
      <TmdbImage src={source ?? ""} alt="Example poster" width={500} height={750} />,
    );

    expect(markup).toContain("https://image.tmdb.org/t/p/w500/poster.jpg");
    expect(markup).not.toContain("/_next/image");
  });

  it("keeps safe GET responses fresh briefly and reusable while revalidating", () => {
    expect(SAFE_GET_CACHE_HEADERS["Cache-Control"]).toBe(
      "public, s-maxage=900, stale-while-revalidate=86400",
    );
  });
});
