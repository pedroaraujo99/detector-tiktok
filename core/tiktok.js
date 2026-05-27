const { chromium } = require("playwright");

async function iniciarTikTok() {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto("https://www.tiktok.com");

  return "TikTok iniciado!";
}

module.exports = {
  iniciarTikTok
};