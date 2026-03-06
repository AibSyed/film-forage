import { expect, test } from "@playwright/test";

test("renders the film-forage picker and supports save plus search flows", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Find a movie worth watching." })).toBeVisible();
  await expect(page.getByLabel("Region")).toBeVisible();
  await expect(page.getByLabel("Availability")).toBeVisible();
  await expect(page.getByRole("button", { name: /Find a movie|Finding.../ })).toBeVisible();

  const firstTitle = (await page.getByTestId("best-match-card").locator("h2").textContent())?.trim() ?? "";
  await page.getByRole("button", { name: /^Save$/ }).first().click();
  await page.getByLabel("Primary").getByRole("link", { name: "Watchlist" }).click();
  await expect(page).toHaveURL(/\/watchlist$/);
  await expect(page.getByRole("heading", { name: "Keep the movies you still want to watch." })).toBeVisible();
  await expect(page.getByRole("heading", { name: firstTitle })).toBeVisible();

  await page.getByLabel("Primary").getByRole("link", { name: "Search" }).click();
  await page.getByLabel("Search by title").fill("Mad");
  await page.locator("form").getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search\?q=Mad/);
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
});
