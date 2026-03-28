/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const {
  waitForAboutPage,
  waitForHomepage,
  waitForThanksPage,
} = require("./helpers/page");

test.describe("routing", () => {
  test("renders about and thanks pages", async ({ page }) => {
    await waitForAboutPage(page);
    await expect(
      page.getByText(
        /exploratory tour through the microscopic world of antarctica/i
      )
    ).toBeVisible();

    await waitForThanksPage(page);
    await expect(page.getByText(/Enormous thanks to/i)).toBeVisible();
  });

  test("supports direct homepage tile routes", async ({ page }) => {
    await page.goto("/1/1", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /DIATOM/i })).toBeVisible();

    await waitForHomepage(page);
    await expect(
      page.getByRole("heading", { name: /TARDIGRADE/i })
    ).toBeVisible();
  });
});
