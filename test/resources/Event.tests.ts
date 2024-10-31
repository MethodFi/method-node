import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { awaitResults } from '../utils';
import type { IEvent } from '../../src/resources/Event';
import type { IWebhook } from '../../src/resources/Webhook';
import type { IEntity } from '../../src/resources/Entity';
import type { IAccount } from '../../src/resources/Account';
import type { IPayment } from '../../src/resources/Payment';
import { IResponse } from '../../src/configuration';

should();

describe('Events - core methods tests', () => {
  // Store responses
  let webhook_response: IResponse<IWebhook>;
  let entity_response: IResponse<IEntity>;
  let source_account: IResponse<IAccount>;
  let destination_account: IResponse<IAccount>;
  let payment_response: IResponse<IPayment>;
  let event_response: IResponse<IEvent>;
  let events_list_response: IResponse<IEvent>[];

  before(async () => {
    // Create webhook for payment.update
    webhook_response = await client.webhooks.create({
      type: 'payment.update',
      url: 'https://dev.methodfi.com',
      auth_token: Math.random().toString(),
    });

    // Create entity
    entity_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        phone: '+15121231111'
      }
    });

    // Create source account
    source_account = await client.accounts.create({
      holder_id: entity_response.id,
      ach: {
        routing: '062103000',
        number: '123456789',
        type: 'checking',
      },
    });

    // Get a liability account for destination
    destination_account = (await client.accounts.list({
      holder_id: entity_response.id,
    }))[0];

    // Create payment
    payment_response = await client.payments.create({
      amount: 5000,
      source: source_account.id,
      destination: destination_account.id,
      description: 'Test payment for events',
    });

    // Simulate payment update
    await client.simulate.payments.update(payment_response.id, {
      status: 'processing'
    });
  });

  describe('events.retrieve', () => {
    it('should successfully retrieve a payment.update event', async () => {
      // Get list of events to find our payment.update event
      const events = await client.events.list({
        type: 'payment.update',
        resource_id: payment_response.id
      });
      
      event_response = await client.events.retrieve(events[0].id);

      const expect_results: IEvent = {
        id: event_response.id,
        type: 'payment.update',
        resource_id: payment_response.id,
        resource_type: 'payment',
        data: event_response.data, // Full payment object snapshot
        diff: event_response.diff,
        created_at: event_response.created_at,
        updated_at: event_response.updated_at
      };

      event_response.should.be.eql(expect_results);
    });
  });

  describe('events.list', () => {
    it('should successfully list events filtered by payment.update type', async () => {
      events_list_response = await client.events.list({
        type: 'payment.update'
      });

      Array.isArray(events_list_response).should.be.true;
      events_list_response.length.should.be.greaterThan(0);
      
      const event = events_list_response.find(e => e.id === event_response.id);
      event?.should.not.be.undefined;
      event?.type.should.equal('payment.update');
      event?.resource_id.should.equal(payment_response.id);
    });
  });

  after(async () => {
    // Cleanup
    await client.webhooks.delete(webhook_response.id);
    await client.payments.delete(payment_response.id);
  });
}); 