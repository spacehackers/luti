/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const { waitForAboutPage, waitForHomepage } = require("./helpers/page");

function installConsoleGuards(page, errors) {
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });
}

test.describe("console smoke", () => {
  test("homepage loads without console or page errors", async ({ page }) => {
    const errors = [];
    installConsoleGuards(page, errors);

    await waitForHomepage(page);
    expect(errors).toEqual([]);
  });

  test("about page loads without console or page errors", async ({ page }) => {
    const errors = [];
    installConsoleGuards(page, errors);

    await waitForAboutPage(page);
    expect(errors).toEqual([]);
  });
});
