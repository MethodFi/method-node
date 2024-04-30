import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IEntity } from '../../src/resources/Entity/types';
import { IElementToken } from '../../src/resources/Element/Token';

should();

describe('Elements - core methods tests', () => {
  let entity_1_response: IEntity | null = null;
  let element_create_token_1_response: IElementToken | null = null;

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
    it('should successfully create an element_token.', async () => {
      element_create_token_1_response = await client.elements.token.create({
        entity_id: entity_1_response?.id || '',
        type: 'link',
        link: {},
      });

      (element_create_token_1_response !== null).should.be.true;
      (element_create_token_1_response.element_token !== null).should.be.true;
    });
  });

  // TODO: test for elements.exchangePublicAccountToken
});
