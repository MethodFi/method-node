/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient, Environments } from '../../src';
import type { TBINResponse } from '../../src/lib/bins/types';
import { BINBrands } from '../../src/lib/bins/enums';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('BINs - core methods tests', () => {
  let bins_get_response: ?TBINResponse = null;
  const amex_platinum_bin = '371307';

  describe('bins.get', () => {
    it('should successfully get a bin.', async () => {
      bins_get_response = await client.bins.get(amex_platinum_bin);

      (bins_get_response !== null).should.be.true;
      bins_get_response.brand.should.equal(BINBrands.amex);
    });
  });
});
