/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("@playwright/test");

async function countVideos(page) {
  return page.locator("video").count();
}

async function sampleVisibleVideos(page) {
  return page.locator("video").evaluateAll((videos) => {
    const debug = window.__videoDebug || {};
    return videos
      .filter((video) => {
        const rect = video.getBoundingClientRect();
        const style = window.getComputedStyle(video);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth &&
          style.visibility !== "hidden" &&
          style.display !== "none"
        );
      })
      .map((video) => ({
        id: video.dataset.videoId || "",
        paused: video.paused,
        currentTime: video.currentTime,
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        lastEvent: debug[video.dataset.videoId || ""]?.lastEvent || null,
        lastEventExtra: debug[video.dataset.videoId || ""]?.extra || null,
      }));
  });
}

async function countVisibleVideos(page) {
  const sample = await sampleVisibleVideos(page);
  return sample.length;
}

async function countVisibleEmptyVideoShells(page) {
  return page.locator("video").evaluateAll((videos) => {
    let count = 0;
    videos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const style = window.getComputedStyle(video);
      const visible =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth &&
        style.visibility !== "hidden" &&
        style.display !== "none";

      if (
        visible &&
        (!video.dataset.videoId || !(video.currentSrc || video.src))
      ) {
        count += 1;
      }
    });
    return count;
  });
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

module.exports = {
  countVideos,
  countVisibleEmptyVideoShells,
  countVisibleVideos,
  expectVisibleVideosReady,
  sampleVisibleVideos,
};
