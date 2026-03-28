async function countVideos(page) {
  return page.locator("video").count();
}

async function sampleVisibleVideos(page) {
  return page.locator("video").evaluateAll((videos) =>
    videos.slice(0, 5).map((video) => ({
      paused: video.paused,
      currentTime: video.currentTime,
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    }))
  );
}

module.exports = {
  countVideos,
  sampleVisibleVideos,
};
