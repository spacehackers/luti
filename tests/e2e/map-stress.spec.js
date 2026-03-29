/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const { sampleVisibleVideos } = require("./helpers/media");
const { waitForHomepage } = require("./helpers/page");

async function dragMap(page, dx, dy) {
  const map = page.locator(".leaflet-container").first();
  const box = await map.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + dx,
    box.y + box.height / 2 + dy,
    {
      steps: 30,
    }
  );
  await page.mouse.up();
}

async function expectVisibleVideosReady(page) {
  await expect
    .poll(async () => {
      const sample = await sampleVisibleVideos(page);
      if (sample.length === 0) {
        return false;
      }
      return sample.every(
        (video) =>
          video.paused === false &&
          video.readyState >= 2 &&
          video.videoWidth > 0 &&
          video.videoHeight > 0
      );
    })
    .toBe(true);
}

test("repeated map drags keep visible videos alive", async ({ page }) => {
  await waitForHomepage(page);

  const drags = [
    [700, 450],
    [-650, -420],
    [540, -360],
    [-520, 340],
  ];

  /* eslint-disable no-await-in-loop */
  for (const [dx, dy] of drags) {
    await dragMap(page, dx, dy);
    await expectVisibleVideosReady(page);
  }
  /* eslint-enable no-await-in-loop */
});
