'use strict';

const path = require('path');
const decrypt = require('crypto-js').AES.decrypt;
const utf8f = require('crypto-js').enc.Utf8;
const env = require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const seed = require(path.join(__dirname, '..', '..', 'app', 'js', 'seed.js')).seed;

const mochaPlugin = require('serverless-mocha');
const expect = require('serverless-mocha').chai.expect;
const getWrapper = require('serverless-mocha').getWrapper;

const wrapped = mochaPlugin.getWrapper('', '../../../service/functions/captcha.js', 'image');

describe('image', () => {
  const body = {};

  before(async () => {
    const responses = await Promise.all([
      wrapped.run({}, {}),
      wrapped.run({
        queryStringParameters: { lang: 'en' }
      }, {}),
      wrapped.run({
        queryStringParameters: { lang: 'pt' }
      }, {})
    ]);

    body.default = JSON.parse(responses[0].body);
    body.en = JSON.parse(responses[1].body);
    body.pt = JSON.parse(responses[2].body);
  });

  it('got responses', async () => {
    Object.values(body).forEach(b => {
      expect(b.success).to.be.true;
    });
  });

  it('got images', async () => {
    Object.values(body).forEach(b => {
      expect(b.image.startsWith('data:image/jpeg;base64,')).to.be.true;
    });
  });

  it('got tokens', async () => {
    Object.values(body).forEach(b => {
      expect(b.token.length).to.be.above(0);
    });
  });

  it('got valid phrase', async () => {
    const phrase  = decrypt(body.default.token, process.env.THE_ANSWER).toString(utf8f);
    const allPhrases = [];

    for (const book of seed) {
      for (const phrases of Object.values(book.phrases)) {
        allPhrases.push(...phrases);
      }
    }

    expect(allPhrases).to.include(phrase);
  });

  it('got valid en phrase', async () => {
    const phrase  = decrypt(body.en.token, process.env.THE_ANSWER).toString(utf8f);
    const langPhrases = [];

    for (const book of seed) {
      if (book.phrases['en']) langPhrases.push(...book.phrases['en']);
    }

    expect(langPhrases).to.include(phrase);
  });

  it('got valid pt phrase', async () => {
    const phrase  = decrypt(body.pt.token, process.env.THE_ANSWER).toString(utf8f);
    const langPhrases = [];

    for (const book of seed) {
      if (book.phrases['pt']) langPhrases.push(...book.phrases['pt']);
    }

    expect(langPhrases).to.include(phrase);
  });
});
