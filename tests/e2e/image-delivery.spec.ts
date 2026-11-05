import { expect, test } from "@playwright/test";

test("saved posters load directly and the image optimizer is unavailable", async ({ page, request }) => {
  const poster = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ioAAAAASUVORK5CYII=",
    "base64",
  );
  const sources = [
    "https://image.tmdb.org/t/p/w500/poster.png",
    "https://example.com/poster.png",
    "http://127.0.0.1:3000/social/film-forage-card.svg",
  ];
  await page.route("https://image.tmdb.org/t/p/w500/poster.png", (route) => route.fulfill({ contentType: "image/png", body: poster }));
  await page.route("https://example.com/poster.png", (route) => route.fulfill({ contentType: "image/png", body: poster }));
  await page.addInitScript((urls) => {
    const savedMovies = urls.map((posterUrl, index) => ({
      id: index + 1,
      title: `Saved film ${index + 1}`,
      year: 2021,
      runtimeMinutes: 103,
      genres: ["Drama"],
      overview: "Overview",
      posterUrl,
      providerSummary: { region: "US", included: [], rent: [], buy: [], note: "Availability unknown", status: "unknown" },
      fitReasons: ["Released in 2021"],
      voteAverage: 7.5,
      provenance: "editorial_reserve",
      note: "Saved note",
      savedAt: "2026-01-01T00:00:00.000Z",
      dismissed: false,
    }));
    localStorage.setItem("film-forage:v4:workspace", JSON.stringify({ version: 4, savedMovies }));
  }, sources);

  await page.goto("/watchlist");
  for (const [index, source] of sources.entries()) {
    const image = page.getByRole("img", { name: `Saved film ${index + 1} poster` });
    await expect(image).toHaveAttribute("src", source);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect(page.getByText("Saved note")).toHaveCount(3);

  const optimized = await request.get("/_next/image?url=%2Fopengraph-image&w=640&q=75");
  expect(optimized.status()).toBe(404);
});
