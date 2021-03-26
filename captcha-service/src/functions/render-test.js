const puppeteer = require('puppeteer');
const fs = require('fs');

const SELECTORS = {
  BUTTON: '#my-button-1984',
  PHRASE: '#my-input-text',
  PAGE: '#page-ready',
  CAPTCHA_READY: '#captcha-ready',
  CAPTCHA_CANVAS: '#my-captcha-canvas'
}

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 720 });

  await page.goto('https://thiagohersan.github.io/captcha-ocr/');
  await page.waitForSelector(SELECTORS.PAGE);
  await page.click(SELECTORS.BUTTON);
  await page.waitForSelector(SELECTORS.CAPTCHA_READY);

  const phraseElement = await page.$(SELECTORS.PHRASE);
  const phrase = await page.evaluate(el => el.value, phraseElement);

  const dataUrl = await page.evaluate(() => {
    const canvas = document.querySelector(SELECTORS.CAPTCHA_CANVAS);
    return canvas.toDataURL();
  });

  const base64String = dataUrl.substr(dataUrl.indexOf(',') + 1);
  const imgBuffer = Buffer.from(base64String, 'base64');
  fs.writeFileSync('image.png', imgBuffer);

  browser.close();

  const success = (phrase.length > 0) && (dataUrl.length > 0);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success,
      phrase,
      image: dataUrl
    })
  }
}

run();
