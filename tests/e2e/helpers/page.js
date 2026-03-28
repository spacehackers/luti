/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("@playwright/test");

async function waitForHomepage(page, options = {}) {
  if (!options.skipGoto) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  }
  await expect(
    page.getByRole("link", { name: "LIFE UNDER THE ICE" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /DRAG TO DISCOVER NEW CREATURES|LOADING MICROBES/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /TARDIGRADE/i })
  ).toBeVisible();
}

async function waitForAboutPage(page, options = {}) {
  if (!options.skipGoto) {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
  }
  await expect(
    page.getByRole("heading", { name: "About the Project" })
  ).toBeVisible();
}

async function waitForThanksPage(page, options = {}) {
  if (!options.skipGoto) {
    await page.goto("/thanks", { waitUntil: "domcontentloaded" });
  }
  await expect(
    page.getByRole("heading", { name: "Acknowledgements" })
  ).toBeVisible();
}

module.exports = {
  waitForAboutPage,
  waitForHomepage,
  waitForThanksPage,
};
