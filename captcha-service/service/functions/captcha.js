'use strict';

const encrypt = require('crypto-js').AES.encrypt;
const decrypt = require('crypto-js').AES.decrypt;
const utf8f = require('crypto-js').enc.Utf8;
const compareTwoStrings = require('string-similarity').compareTwoStrings;

const chrome = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

chrome.setHeadlessMode = true;
chrome.setGraphicsMode = false;

module.exports.compare = async (event, context) => {
  const body = JSON.parse(event.body);
  const phrase = toLower(body.phrase);
  const answer = toLower(decrypt(body.token,
                                 process.env.THE_ANSWER).toString(utf8f));

  const success = (compareTwoStrings(phrase, answer) > 0.8);
  const url = success ? process.env.SUCCESS_URL : '';

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': checkOrigin(event.headers),
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success,
      url
    })
  }
}

module.exports.image = async (event, context) => {
  const SELECTORS = JSON.parse(process.env.CAPTCHA_SELECTORS);

  const mLang = event.queryStringParameters ? (event.queryStringParameters.lang || 'en') : 'en';

  const browser = await puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath(),
    headless: true,
    ignoreHTTPSErrors: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 720 });

  await page.goto(`${process.env.CAPTCHA_URL}?lang=${mLang}`);
  await page.waitForSelector(SELECTORS.CAPTCHA_READY);

  const phraseElement = await page.$(SELECTORS.PHRASE);
  const phrase = await page.evaluate(el => el.value, phraseElement);

  const canvasElement = await page.$(SELECTORS.CAPTCHA_CANVAS);
  const dataUrl = await page.evaluate(el => el.toDataURL('image/jpeg'), canvasElement);

  browser.close();

  const success = (phrase.length > 0) && (dataUrl.startsWith('data:image/jpeg;base64,'));
  const token = encrypt(phrase, process.env.THE_ANSWER).toString();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': checkOrigin(event.headers),
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success,
      token,
      image: dataUrl
    })
  }
}

function checkOrigin(headers) {
  const CORS_ORIGINS = JSON.parse(process.env.CORS_ORIGINS);
  if(!headers) return CORS_ORIGINS[0];
  const reqOrigin = headers.origin || headers.Origin || '';

  for (const origin of CORS_ORIGINS) {
    if (reqOrigin.includes(origin)) return reqOrigin;
  }
  return CORS_ORIGINS[0];
}

function toLower(str) {
  return str.replace(/[ .,!]/g, '').toLowerCase();
}
