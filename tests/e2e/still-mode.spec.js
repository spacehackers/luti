/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const { createRequestRecorder } = require("./helpers/network");

test.describe("still mode", () => {
  test("forced still mode swaps to JPGs and avoids HLS requests", async ({
    page,
  }) => {
    const requests = createRequestRecorder(page);

    await page.goto("/?stillMode=1", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /DRAG TO DISCOVER NEW CREATURES/i })
    ).toBeVisible();
    await page.waitForTimeout(1500);

    await expect(page.locator("video")).toHaveCount(0);
    await expect(page.locator("img")).toHaveCount(10);

    expect(requests.findBySubstring(".jpg").length).toBeGreaterThan(0);
    expect(requests.findBySubstring(".m3u8")).toEqual([]);
    expect(requests.findBySubstring(".ts")).toEqual([]);
  });
});
