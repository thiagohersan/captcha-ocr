'use strict';

const path = require('path');
const encrypt = require('crypto-js').AES.encrypt;
const env = require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const mochaPlugin = require('serverless-mocha');
const expect = require('serverless-mocha').chai.expect;
const getWrapper = require('serverless-mocha').getWrapper;

const wrapped = getWrapper('compare', '../../../service/functions/captcha.js', 'compare');

describe('compare', () => {
  before((done) => {
    done();
  });

  it('post right answer', async () => {
    const response = await wrapped.run({
      body: JSON.stringify({
        phrase: process.env.THE_ANSWER,
        token: encrypt(process.env.THE_ANSWER, process.env.THE_ANSWER).toString()
      })
    }, {});

    const rbody = JSON.parse(response.body);
    expect(rbody.success).to.be.true;
  });

  it('post wrong answer', async () => {
    const response = await wrapped.run({
      body: JSON.stringify({
        phrase: process.env.THE_ANSWER.replace(/[AE]/g, ''),
        token: encrypt(process.env.THE_ANSWER, process.env.THE_ANSWER).toString()
      })
    }, {});

    const rbody = JSON.parse(response.body);
    expect(rbody.success).to.be.false;
  });
});
