import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IEntity } from '../../src/resources/Entity/types';
import { IElementToken } from '../../src/resources/Element/Token';

should();

describe('Elements - core methods tests', () => {
  let entity_1_response: IEntity | null = null;
  let element_create_connect_token_response: IElementToken | null = null;

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
    it('should successfully create a link element_token.', async () => {
      const element_create_link_token_response = await client.elements.token.create({
        entity_id: entity_1_response?.id || '',
        type: 'link',
        link: {},
      });
      
      Object.keys(element_create_link_token_response).should.include('element_token');
      Object.keys(element_create_link_token_response).should.be.length(1);
    });

    it('should successfully create an auth element_token.', async () => {
      const element_create_auth_token_response = await client.elements.token.create({
        entity_id: entity_1_response?.id || '',
        type: 'auth',
        auth: {
          account_filters: {
            selection_type: 'multiple',
            capabilities: ['payments:receive', 'data:sync'],
            types: ['auto_loan', 'credit_card']
          }
        },
      });

      Object.keys(element_create_auth_token_response).should.include('element_token');
      Object.keys(element_create_auth_token_response).should.be.length(1);    });

    it('should successfully create a connect element_token.', async () => {
      element_create_connect_token_response = await client.elements.token.create({
        entity_id: entity_1_response?.id || '',
        type: 'connect',
        connect: {
          products: ['balance'],
        }
      });

      Object.keys(element_create_connect_token_response).should.include('element_token');
      Object.keys(element_create_connect_token_response).should.be.length(1);
    });

    it('should successfully retrieve the results of a created element_token.', async () => {
      const element_retrieve_retults_response = await client.elements.token.results(element_create_connect_token_response?.element_token || '');
      const expect_results = {
        authenticated: false,
        cxn_id: null,
        accounts: [],
        entity_id: entity_1_response?.id || '',
        events: []
      };

      element_retrieve_retults_response.should.be.eql(expect_results);
    });
  });
});
