/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient } from '../../src';
import { Environments } from '../../src/client/enums';
import type { TElementCreateTokenResponse } from '../../src/lib/elements/types';
import type { TEntityResponse } from '../../src/lib/entities/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Elements - core methods tests', () => {
  let entity_1_response: ?TEntityResponse = null;
  let element_create_token_1_response: ?TElementCreateTokenResponse = null;

  before(async () => {
    entity_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        dob: '1930-03-11',
        email: 'kevin.doyle@gmail.com',
        phone: '+16505555555',
      },
    });
  });

  describe('elements.createToken', () => {
    it('should successfully create an element_token.', async () => {
      element_create_token_1_response = await client.elements.createToken({
        entity_id: entity_1_response.id,
        type: 'link',
        link: {},
      });

      (element_create_token_1_response !== null).should.be.true;
      (element_create_token_1_response.element_token !== null).should.be.true;
    });
  });

  // TODO: test for elements.exchangePublicAccountToken
});
