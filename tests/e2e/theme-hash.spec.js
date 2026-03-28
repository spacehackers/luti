/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");

test.describe("theme hash", () => {
  test("dark hash applies the dark body class without breaking the page", async ({
    page,
  }) => {
    await page.goto("/#dark", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("link", { name: "LIFE UNDER THE ICE" })
    ).toBeVisible();
    await expect(page.locator("body")).toHaveClass(/dark/);
  });
});
