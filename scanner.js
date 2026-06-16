const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

async function scanPage(url) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForTimeout(2000);

  await page.addScriptTag({ content: axeSource });

  const results = await page.evaluate(async () => {
    return await axe.run();
  });

  await browser.close();
  return results;
}

module.exports = { scanPage };