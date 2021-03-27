'use strict';

const path = require('path');
const decrypt = require('crypto-js').AES.decrypt;
const utf8f = require('crypto-js').enc.Utf8;
const env = require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const seed = require(path.join(__dirname, '..', 'app', 'js', 'seed.js')).seed;

const mochaPlugin = require('serverless-mocha');
const expect = require('serverless-mocha').chai.expect;
const getWrapper = require('serverless-mocha').getWrapper;

const wrapped = mochaPlugin.getWrapper('image', '../../../service/functions/captcha.js', 'image');

describe('image', () => {
  let body;

  before(async () => {
    const response = await wrapped.run({}, {});
    body = JSON.parse(response.body);
  });

  it('got response', async () => {
    expect(body.success).to.be.true;
  });

  it('got image', async () => {
    expect(body.image.startsWith('data:image/png;base64,')).to.be.true;
  });

  it('got token', async () => {
    expect(body.token.length).to.be.above(0);
  });

  it('got valid phrase', async () => {
    const phrase  = decrypt(body.token, process.env.THE_ANSWER).toString(utf8f);
    const allPhrases = [];

    for (const book of seed) {
      for (const phrases of Object.values(book.phrases)) {
        allPhrases.push(...phrases);
      }
    }

    expect(allPhrases).to.include(phrase);
  });
});
