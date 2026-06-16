const { chromium } = require('playwright');
const axeSource = require('axe-core').source;



async function scanPage(url) {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
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

    return results;

  } catch (err) {
    console.error("Scan error:", err);
    throw err;

  } finally {
    if (browser) await browser.close();
  }
}


module.exports = { scanPage };