import { expect, test } from "@playwright/test";

test("renders the tonight picker and supports save plus search flows", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Pick tonight's movie without the browsing spiral." })).toBeVisible();
  await expect(page.getByLabel("Region")).toBeVisible();
  await expect(page.getByLabel("Availability")).toBeVisible();
  await expect(page.getByRole("button", { name: /Find a movie|Refreshing.../ })).toBeVisible();

  const firstTitle = (await page.getByTestId("best-match-card").locator("h2").textContent())?.trim() ?? "";
  await page.getByRole("button", { name: /^Save$/ }).first().click();
  await page.getByRole("button", { name: "Open watchlist" }).click();
  await expect(page).toHaveURL(/\/watchlist$/);
  await expect(page.getByRole("heading", { name: "Keep the picks that survive the first round." })).toBeVisible();
  await expect(page.getByText(firstTitle)).toBeVisible();

  await page.getByRole("link", { name: "Search" }).click();
  await page.getByLabel("Title lookup").fill("Mad");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search\?q=Mad/);
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
});
