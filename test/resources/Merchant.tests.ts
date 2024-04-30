import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IMerchant } from '../../src/resources/Merchant';

should();

describe('Merchants - core methods tests', () => {
  let merchants_get_response: IMerchant | null = null;
  let merchants_list_response: IMerchant[] | null = null;
  const amex_mch_id = 'mch_3';
  const amex_provider_id_plaid = 'ins_10';
  const amex_expected_mch_id = 'mch_300485';

  describe('merchants.get', () => {
    it('should successfully get a merchant.', async () => {
      merchants_get_response = await client.merchants.retrieve(amex_mch_id);

      (merchants_get_response !== null).should.be.true;
    });
  });

  describe('merchants.list', () => {
    it('should successfully list merchants.', async () => {
      merchants_list_response = await client.merchants.list({ 'provider_id.plaid': amex_provider_id_plaid });

      (merchants_list_response !== null).should.be.true;
      Array.isArray(merchants_list_response).should.be.true;

      merchants_list_response.length.should.equal(1);
      merchants_list_response[0].mch_id.should.equal(amex_expected_mch_id);
    });
  });
});
