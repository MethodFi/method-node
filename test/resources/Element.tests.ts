import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IEntity } from '../../src/resources/Entity';
import type { IElementResults, IElementToken } from '../../src/resources/Element';
import { IResponse } from '../../src/configuration';

should();

describe('Elements - core methods tests', () => {
  let entity_1_response: IResponse<IEntity>;
  let element_create_connect_token_response: IResponse<IElementToken>;

  before(async () => {
    entity_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        dob: '1930-03-11',
        email: 'kevin.doyle@gmail.com',
        phone: '+15121231111',
      },
    });
  });

  describe('elements.token.create', () => {
    it('should successfully create a connect element_token.', async () => {
      element_create_connect_token_response = await client.elements.token.create({
        entity_id: entity_1_response.id,
        type: 'connect',
        connect: {
          products: ['balance'],
          account_filters: {
            selection_type: 'multiple',
            liability_types: ['credit_card']
          },
        }
      });

      // TODO: Add back once fixed

      // const element_create_balance_transfer_token_response = await client.elements.token.create({
      //   entity_id: entity_1_response.id,
      //   type: 'balance_transfer',
      //   balance_transfer: {
      //     payout_amount_min: 100,
      //     minimum_loan_amount: 1000,
      //     payout_residual_amount_max: 1000,
      //     loan_details_requested_amount: 1000,
      //     loan_details_requested_rate: 0.1,
      //     loan_details_requested_term: 12,
      //     loan_details_requested_monthly_payment: 100,
      //   }
      // });

      // Object.keys(element_create_balance_transfer_token_response).should.include('element_token');
      // Object.keys(element_create_balance_transfer_token_response).should.be.length(1);

      Object.keys(element_create_connect_token_response).should.include('element_token');
      Object.keys(element_create_connect_token_response).should.be.length(1);
    });

    it('should successfully retrieve the results of a created element_token.', async () => {
      const element_retrieve_retults_response = await client.elements.token.results(element_create_connect_token_response.element_token);
      
      const expect_results: IElementResults = {
        authenticated: false,
        cxn_id: null,
        accounts: [],
        entity_id: entity_1_response.id,
        events: [],
      };

      element_retrieve_retults_response.should.be.eql(expect_results);
    });
  });
});
