const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

async function scanPage(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  await page.addScriptTag({ content: axeSource });

  const results = await page.evaluate(async () => {
    return await axe.run();
  });

  await browser.close();

  return results;
}

module.exports = { scanPage };