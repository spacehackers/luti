/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const {
  expectVisibleVideosReady,
  sampleVisibleVideos,
} = require("./helpers/media");
const { waitForHomepage } = require("./helpers/page");

test.describe("map interaction", () => {
  test("zoom controls stay visible and keep the homepage functional", async ({
    page,
  }) => {
    await waitForHomepage(page);

    const zoomIn = page.getByRole("button", { name: "Zoom in" });
    const zoomOut = page.getByRole("button", { name: "Zoom out" });
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();

    const firstSample = await sampleVisibleVideos(page);

    await zoomIn.click();
    await expect(
      page.getByRole("heading", { name: /TARDIGRADE/i })
    ).toBeVisible();

    await zoomOut.click();
    await expect(
      page.getByRole("heading", { name: /TARDIGRADE/i })
    ).toBeVisible();

    await expectVisibleVideosReady(page);
    await page.waitForTimeout(1500);
    const secondSample = await sampleVisibleVideos(page);
    const advancingVideos = secondSample.filter(
      (video, index) =>
        video.paused === false &&
        video.currentTime > firstSample[index].currentTime
    );

    expect(advancingVideos.length).toBeGreaterThan(0);
  });

  test("dragging the map moves the Leaflet pane and keeps video alive", async ({
    page,
  }) => {
    await waitForHomepage(page);

    const map = page.locator(".leaflet-container").first();
    const pane = page.locator(".leaflet-map-pane").first();
    const infoTitle = page.locator(".info-title h1");
    await expect(map).toBeVisible();
    await expect(pane).toHaveCount(1);
    const box = await map.boundingBox();
    expect(box).not.toBeNull();

    const initialTransform = await pane.evaluate(
      (element) => getComputedStyle(element).transform
    );
    const initialTitle = await infoTitle.textContent();

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + 700,
      box.y + box.height / 2 + 450,
      {
        steps: 30,
      }
    );
    await page.mouse.up();

    await expect
      .poll(() =>
        pane.evaluate((element) => getComputedStyle(element).transform)
      )
      .not.toBe(initialTransform);
    await expect.poll(() => infoTitle.textContent()).not.toBe(initialTitle);

    await expectVisibleVideosReady(page);

    const firstSample = await sampleVisibleVideos(page);
    await page.waitForTimeout(1500);
    await expectVisibleVideosReady(page);

    const secondSample = await sampleVisibleVideos(page);

    const advancingVideos = secondSample.filter(
      (video, index) =>
        video.paused === false &&
        video.currentTime > firstSample[index].currentTime
    );

    expect(advancingVideos.length).toBeGreaterThan(0);
  });
});
