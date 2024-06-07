import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IMerchant } from '../../src/resources/Merchant';

should();

describe('Merchants - core methods tests', () => {
  let merchants_retrieve_response: IMerchant;
  let merchants_list_response: IMerchant[];
  const amex_mch_id = 'mch_3';
  const amex_provider_id_plaid = 'ins_10';

  describe('merchants.retrieve', () => {
    it('should successfully retroeve a merchant by id.', async () => {
      merchants_retrieve_response = await client.merchants.retrieve(amex_mch_id);
      
      const expect_results: IMerchant = {
        id: 'mch_3',
        parent_name: 'American Express',
        name: 'American Express - Credit Cards',
        logo: 'https://static.methodfi.com/mch_logos/mch_3.png',
        type: 'credit_card',
        provider_ids: {
          plaid: [ 'ins_10' ],
          mx: [ 'amex' ],
          finicity: [],
          dpp: [ '120', '18954427', '11859365', '18947131', '16255844' ]
        },
        is_temp: false,
        account_number_formats: []
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
        id: 'mch_300485',
        parent_name: 'American Express',
        name: 'American Express Credit Card',
        logo: 'https://static.methodfi.com/mch_logos/mch_300485.png',
        type: 'credit_card',
        provider_ids: {
            plaid: [
                'ins_10'
            ],
            mx: [
                'amex'
            ],
            finicity: [],
            dpp: [
                '7929257',
                '120',
                '18391555',
                '18954427',
                '11859365',
                '18947131',
                '16255844'
            ]
        },
        is_temp: false,
        account_number_formats: [
            '###############'
        ]
      };

      merchant_to_use.should.be.eql(expect_results);
    });
  });
});
