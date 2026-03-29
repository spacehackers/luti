/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const {
  countVisibleVideos,
  expectNoEmptyVisibleVideoShells,
  expectVisibleVideosReady,
} = require("./helpers/media");
const { createRequestRecorder } = require("./helpers/network");
const { waitForHomepage } = require("./helpers/page");

test.describe("idle wake", () => {
  test("idle timeout swaps visible tiles to stills and wakes back to live video", async ({
    page,
  }) => {
    const requests = createRequestRecorder(page);

    await page.goto("/?idleMs=3000", { waitUntil: "domcontentloaded" });
    await waitForHomepage(page, { skipGoto: true });
    await expectVisibleVideosReady(page);

    await expect.poll(() => countVisibleVideos(page)).toBe(0);
    await expect.poll(() => page.locator("img").count()).toBeGreaterThan(0);

    const idleRequestCount = requests.findBySubstring(".ts").length;

    await page.mouse.move(300, 300);
    await expectVisibleVideosReady(page);
    await expectNoEmptyVisibleVideoShells(page);
    await expect.poll(() => countVisibleVideos(page)).toBeGreaterThan(0);

    expect(requests.findBySubstring(".ts").length).toBeGreaterThan(
      idleRequestCount
    );
  });
});
