/* eslint-disable import/no-extraneous-dependencies */
const { test } = require("@playwright/test");
const {
  expectNoEmptyVisibleVideoShells,
  expectVisibleVideosReady,
} = require("./helpers/media");
const { waitForHomepage } = require("./helpers/page");

test("repeated zoom changes keep visible videos alive", async ({ page }) => {
  await waitForHomepage(page);

  const zoomIn = page.getByRole("button", { name: "Zoom in" });
  const zoomOut = page.getByRole("button", { name: "Zoom out" });

  const actions = [zoomIn, zoomOut, zoomIn, zoomOut, zoomIn, zoomOut];

  /* eslint-disable no-await-in-loop */
  for (const action of actions) {
    await action.click();
    await expectVisibleVideosReady(page);
    await expectNoEmptyVisibleVideoShells(page);
  }
  /* eslint-enable no-await-in-loop */
});
