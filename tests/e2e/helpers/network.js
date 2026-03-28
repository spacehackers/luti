function createRequestRecorder(page) {
  const urls = [];
  page.on("request", (request) => {
    urls.push(request.url());
  });

  return {
    urls,
    findBySubstring(substring) {
      return urls.filter((url) => url.includes(substring));
    },
  };
}

module.exports = {
  createRequestRecorder,
};
