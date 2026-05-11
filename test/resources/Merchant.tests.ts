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
      
      merchants_retrieve_response.id.should.be.eql('mch_3');
      merchants_retrieve_response.parent_name.should.be.eql('American Express');
      merchants_retrieve_response.type.should.be.eql('credit_card');
      merchants_retrieve_response.provider_ids.plaid.should.be.eql([ 'ins_10' ]);
      merchants_retrieve_response.provider_ids.mx.should.be.eql([ 'amex' ]);
      merchants_retrieve_response.is_temp.should.be.eql(false);
    });
  });

  describe('merchants.list', () => {
    it('should successfully list merchants.', async () => {
      merchants_list_response = await client.merchants.list({ 'provider_id.plaid': amex_provider_id_plaid });
      merchants_list_response.should.not.be.null;
      Array.isArray(merchants_list_response).should.be.true;
      const merchant_to_use = merchants_list_response[0];
      
      merchant_to_use.parent_name.should.be.eql('American Express');
      merchant_to_use.type.should.be.eql('credit_card');
      merchant_to_use.provider_ids.plaid.should.be.eql([ 'ins_10' ]);
      merchant_to_use.provider_ids.mx.should.be.eql([ 'amex' ]);
      merchant_to_use.is_temp.should.be.eql(false);
    });
  });
});
