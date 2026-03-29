/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const {
  expectNoEmptyVisibleVideoShells,
  expectVisibleVideosReady,
} = require("./helpers/media");
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

  test("deep-link tile routes load playback for several non-home tiles", async ({
    page,
  }) => {
    const routes = [
      { path: "/1/1", title: /DIATOM/i },
      { path: "/8/1", title: /ENTOMONEIS DIATOM/i },
      { path: "/5/1", title: /TARDIGRADE/i },
    ];

    /* eslint-disable no-await-in-loop */
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: route.title })
      ).toBeVisible();
      await expectVisibleVideosReady(page);
      await expectNoEmptyVisibleVideoShells(page);
    }
    /* eslint-enable no-await-in-loop */
  });
});
