'use strict';

const utf8f = require('crypto-js').enc.Utf8;
const decrypt = require('crypto-js').AES.decrypt;
const compareTwoStrings = require('string-similarity').compareTwoStrings;

module.exports.compare = async (event, context) => {
  const body = JSON.parse(event.body);
  const phrase = toLower(body.phrase);
  const answer  = toLower(decrypt(body.token,
                                  process.env.THE_ANSWER).toString(utf8f));

  const success = (compareTwoStrings(phrase, answer) > 0.8);
  const url = success ? process.env.SUCCESS_URL : process.env.FAIL_URL;

  return {
    statusCode: 200,
    body: JSON.stringify({
      success,
      url
    })
  }
}

module.exports.image = async (event, context) => {
  const success = true;

  return {
    statusCode: 200,
    body: JSON.stringify({
      success,
      url: 'http://aaaaaaa.com/haha.jpg',
      token: 'jaja191873hjsjjw72'
    })
  }
}

function toLower(str) {
  return str.replace(/ /g, '').toLowerCase();
}
