import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IMerchant } from '../../src/resources/Merchant';
import { IResponse } from '../../src/configuration';

should();

describe('Merchants - core methods tests', () => {
  let merchants_retrieve_response: IResponse<IMerchant>;
  let merchants_list_response: IResponse<IMerchant>[];
  const amex_mch_id = 'mch_3';
  const amex_provider_id_plaid = 'ins_10';

  describe('merchants.retrieve', () => {
    it('should successfully retroeve a merchant by id.', async () => {
      merchants_retrieve_response = await client.merchants.retrieve(amex_mch_id);

      const expect_results: IMerchant = {
        id: 'mch_3',
        parent_name: 'American Express',
        name: merchants_retrieve_response.name,
        logo: 'https://static.methodfi.com/mch_logos/mch_3.png',
        type: 'credit_card',
        provider_ids: {
          plaid: [ 'ins_10' ],
          mx: [ 'amex' ],
          finicity: [],
          dpp: merchants_retrieve_response.provider_ids.dpp,
          rpps: merchants_retrieve_response.provider_ids.rpps,
        },
        is_temp: false,
        account_number_formats: [],
      };

      merchants_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('merchants.list', () => {
    it('should successfully list merchants.', async () => {
      merchants_list_response = await client.merchants.list({ 'provider_id.plaid': amex_provider_id_plaid });
      merchants_list_response.should.not.be.null;
      Array.isArray(merchants_list_response).should.be.true;
      const merchant_to_use = merchants_list_response[0];
      
      const expect_results: IMerchant = {
        id: merchant_to_use.id,
        parent_name: 'American Express',
        name: merchant_to_use.name,
        logo: merchant_to_use.logo,
        type: 'credit_card',
        provider_ids: {
            plaid: [
                'ins_10'
            ],
            mx: [
                'amex'
            ],
            finicity: merchant_to_use.provider_ids.finicity,
            dpp: merchant_to_use.provider_ids.dpp,
            rpps: merchant_to_use.provider_ids.rpps,
        },
        is_temp: false,
        account_number_formats: merchant_to_use.account_number_formats,
      };

      merchant_to_use.should.be.eql(expect_results);
    });
  });
});
