/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const { countVideos, sampleVisibleVideos } = require("./helpers/media");
const { waitForHomepage } = require("./helpers/page");

test.describe("homepage playback", () => {
  test("renders the homepage shell and starts visible videos", async ({
    page,
  }) => {
    await waitForHomepage(page);

    await expect.poll(() => countVideos(page)).toBeGreaterThan(0);
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

    const firstSample = await sampleVisibleVideos(page);
    expect(firstSample.length).toBeGreaterThan(0);
    firstSample.forEach((video) => {
      expect(video.paused).toBe(false);
      expect(video.readyState).toBeGreaterThanOrEqual(2);
      expect(video.videoWidth).toBeGreaterThan(0);
      expect(video.videoHeight).toBeGreaterThan(0);
    });

    await page.waitForTimeout(2000);

    const secondSample = await sampleVisibleVideos(page);
    const advancingVideos = secondSample.filter(
      (video, index) => video.currentTime > firstSample[index].currentTime
    );
    expect(advancingVideos.length).toBeGreaterThan(0);
  });
});
