import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IEntity } from '../../src/resources/Entity';
import type { IOpalToken } from '../../src/resources/Opal';
import { IResponse } from '../../src/configuration';

should();

describe('Opal - core methods tests', () => {
  let entity_1_response: IResponse<IEntity>;
  let opal_create_token_response: IResponse<IOpalToken>;

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

  describe('opal.token.create', () => {
    it('should successfully create a opal token.', async () => {
      opal_create_token_response = await client.opal.token.create({
        entity_id: entity_1_response.id,
        mode: 'identity_verification',
        identity_verification: {
          skip_pii: ['ssn_4'],
        },
      });

      opal_create_token_response.should.have.property('token');
      opal_create_token_response.should.have.property('valid_until');
      opal_create_token_response.should.have.property('session_id');
    });
  });
});
