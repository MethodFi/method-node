/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient } from '../../src';
import { Environments } from '../../src/client/enums';
import type { TMerchantResponse } from '../../src/lib/merchants/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Merchants - core methods tests', () => {
  let merchants_get_response: ?TMerchantResponse = null;
  let merchants_list_response: ?Array<TMerchantResponse> = null;
  const amex_mch_id = 'mch_3';
  const amex_provider_id_plaid = 'ins_10';

  describe('merchants.get', () => {
    it('should successfully get a merchant.', async () => {
      merchants_get_response = await client.merchants.get(amex_mch_id);

      (merchants_get_response !== null).should.be.true;
    });
  });

  describe('merchants.list', () => {
    it('should successfully list merchants.', async () => {
      merchants_list_response = await client.merchants.list({ 'provider_id.plaid': amex_provider_id_plaid });

      (merchants_list_response !== null).should.be.true;
      Array.isArray(merchants_list_response).should.be.true;

      merchants_list_response.length.should.equal(1);
      merchants_list_response[0].mch_id.should.equal(amex_mch_id);
    });
  });
});
