import { expect, test } from "@playwright/test";

test("renders film forage discovery hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /cinematic discovery tuned to your mood state/i })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /mood/i })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /genre/i })).toBeVisible();
});
