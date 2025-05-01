import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IEvent } from '../../src/resources/Event';
import type { 
  IEntity,
  IEntityConnect,
  IEntityAttributes,
  IEntityCreditScores,
} from '../../src/resources/Entity/types';
import { EntityAttributeNames } from '../../src/resources/Entity/types';
import type { IAccount } from '../../src/resources/Account';
import { IResponse } from '../../src/configuration';

should();

describe('Events - core methods tests', () => {
  let entity_response: IResponse<IEntity>;
  let connect_response: IResponse<IEntityConnect>;
  let attribute_response: IResponse<IEntityAttributes>;
  let credit_score_response: IResponse<IEntityCreditScores>;
  let event_response: IResponse<IEvent>;
  let account_response: IResponse<IAccount>[];

  before(async () => {
    entity_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        phone: '+15121231111',
      },
    });

    await client.entities(entity_response.id).verificationSessions.create({
      type: 'phone',
      method: 'byo_sms',
      byo_sms: {
        timestamp: new Date().toISOString(),
      },
    });

    await client.entities(entity_response.id).verificationSessions.create({
      type: 'identity',
      method: 'kba',
      kba: {
      },
    });

    connect_response = await client.entities(entity_response.id).connect.create();

    account_response = await client.accounts.list({
      holder_id: entity_response.id,
    });

    attribute_response = await client.entities(entity_response.id).attributes.create({
      attributes: [EntityAttributeNames.credit_health_credit_card_usage],
    });

    credit_score_response = await client.entities(entity_response.id).creditScores.create();
  });

  describe('simulate.events', () => {

    it('should simulate an account opened event', async () => {
      await client.simulate.events.create({
        type: 'account.opened',
        entity_id: entity_response.id,
      });

      // timeout to allow event to be created
      await new Promise((resolve) => { setTimeout(resolve, 5000); });

      const events_list_response = await client.events.list({
        type: 'account.opened',
      });

      [event_response] = events_list_response;

      const response = await client.events.retrieve(event_response.id);

      const expect_results: IEvent = {
        id: event_response.id,
        created_at: event_response.created_at,
        updated_at: event_response.updated_at,
        type: 'account.opened',
        resource_id: event_response.resource_id,
        resource_type: 'account',
        data: event_response.data,
        diff: event_response.diff,
      };

      response.should.be.eql(expect_results);
    });

    it('should simulate an attribute created event', async () => {
      await client.simulate.events.create({
        type: 'attribute.credit_health_credit_card_usage.increased',
        entity_id: entity_response.id,
      });

      // timeout to allow event to be created
      await new Promise((resolve) => { setTimeout(resolve, 5000); });

      const events_list_response = await client.events.list({
        type: 'attribute.credit_health_credit_card_usage.increased',
      });

      [event_response] = events_list_response;

      const response = await client.events.retrieve(event_response.id);

      const expect_results: IEvent = {
        id: event_response.id,
        created_at: event_response.created_at,
        updated_at: event_response.updated_at,
        type: 'attribute.credit_health_credit_card_usage.increased',
        resource_id: event_response.resource_id,
        resource_type: 'attribute',
        data: event_response.data,
        diff: event_response.diff,
      };

      response.should.be.eql(expect_results);
    });
  });
});
