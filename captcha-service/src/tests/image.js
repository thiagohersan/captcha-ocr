'use strict';

const mochaPlugin = require('serverless-mocha');
const expect = require('serverless-mocha').chai.expect;
const getWrapper = require('serverless-mocha').getWrapper;

const wrapped = mochaPlugin.getWrapper('image', '../../../src/functions/captcha.js', 'image');

describe('image', () => {
  before((done) => {
    done();
  });

  it('get image', async () => {
    const response = await wrapped.run({}, {});

    const rbody = JSON.parse(response.body);
    expect(rbody.success).to.be.true;
  });
});
