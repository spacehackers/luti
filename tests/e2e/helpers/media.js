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

module.exports = {
  countVideos,
  sampleVisibleVideos,
};
