'use strict';

const encrypt = require('crypto-js').AES.encrypt;
const decrypt = require('crypto-js').AES.decrypt;
const utf8f = require('crypto-js').enc.Utf8;
const compareTwoStrings = require('string-similarity').compareTwoStrings;

const chrome = require('chrome-aws-lambda');

module.exports.compare = async (event, context) => {
  const body = JSON.parse(event.body);
  const phrase = toLower(body.phrase);
  const answer  = toLower(decrypt(body.token,
                                  process.env.THE_ANSWER).toString(utf8f));

  const success = (compareTwoStrings(phrase, answer) > 0.98);
  const url = success ? process.env.SUCCESS_URL : '';

  return {
    statusCode: 200,
    body: JSON.stringify({
      success,
      url
    })
  }
}

module.exports.image = async (event, context) => {
  const SELECTORS = JSON.parse(process.env.CAPTCHA_SELECTORS);
  const browser = await chrome.puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 720 });

  await page.goto(process.env.CAPTCHA_URL);
  await page.waitForSelector(SELECTORS.PAGE);
  await page.click(SELECTORS.BUTTON);
  await page.waitForSelector(SELECTORS.CAPTCHA_READY);

  const phraseElement = await page.$(SELECTORS.PHRASE);
  const phrase = await page.evaluate(el => el.value, phraseElement);

  const canvasElement = await page.$(SELECTORS.CAPTCHA_CANVAS);
  const dataUrl = await page.evaluate(el => el.toDataURL(), canvasElement);

  browser.close();

  const success = (phrase.length > 0) && (dataUrl.startsWith('data:image/png;base64,'));
  const token = encrypt(phrase, process.env.THE_ANSWER).toString();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success,
      token,
      image: dataUrl
    })
  }
}

function toLower(str) {
  return str.replace(/ /g, '').toLowerCase();
}
