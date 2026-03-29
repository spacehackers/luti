/* eslint-disable import/no-extraneous-dependencies */
const { test, expect } = require("@playwright/test");
const { waitForAboutPage, waitForHomepage } = require("./helpers/page");

function installConsoleGuards(page, errors) {
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.stack || error.message}`);
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

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
    await waitForHomepage(page, { skipGoto: true });
  });

  test("about page loads without console or page errors", async ({ page }) => {
    const errors = [];
    installConsoleGuards(page, errors);

    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
    await waitForAboutPage(page, { skipGoto: true });
  });
});
