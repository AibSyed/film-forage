import { expect, test } from "@playwright/test";

test("renders cinematic discovery experience", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Find Tonight’s Cinematic Obsession" })).toBeVisible();
  await expect(page.getByLabel("Mood")).toBeVisible();
  await expect(page.getByLabel("Genre")).toBeVisible();
  await expect(page.getByLabel("Runtime")).toBeVisible();
  await expect(page.getByRole("region", { name: "Cinematic discovery stage" })).toBeVisible();

  await page.getByRole("link", { name: "Open shortlist" }).first().click();
  await expect(page).toHaveURL(/\/shortlist$/);
  await expect(page.getByRole("heading", { name: "Noir Shortlist", level: 1 })).toBeVisible();
});
