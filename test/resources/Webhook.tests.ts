import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IWebhook } from '../../src/resources/Webhook';
import { IResponse } from '../../src/configuration';

should();

// TODO: Add tests for each webhook type
describe('Webhooks - core methods tests', () => {
  let webhooks_create_response: IResponse<IWebhook>;
  let webhooks_retrieve_response: IResponse<IWebhook>;
  let webhooks_list_response: IResponse<IWebhook>[];
  let webhooks_delete_response: IResponse<{}>;

  describe('webhooks.create', () => {
    it('should successfully create a webhook.', async () => {
      webhooks_create_response = await client.webhooks.create({
        type: 'payment.create',
        url: 'https://dev.methodfi.com',
        auth_token: Math.random().toString(),
      });

      const expect_results: IWebhook = {
        id: webhooks_create_response.id,
        type: 'payment.create',
        url: 'https://dev.methodfi.com',
        metadata: null,
        created_at: webhooks_create_response.created_at,
        updated_at: webhooks_create_response.updated_at,
        expand_event: false,
      };

      webhooks_create_response.should.be.eql(expect_results);
    });
  });

  describe('webhooks.retrieve', () => {
    it('should successfully retrieve a webhook.', async () => {
      webhooks_retrieve_response = await client.webhooks.retrieve(webhooks_create_response.id);

      const expect_results: IWebhook = {
        id: webhooks_create_response.id,
        type: 'payment.create',
        url: 'https://dev.methodfi.com',
        metadata: null,
        created_at: webhooks_retrieve_response.created_at,
        updated_at: webhooks_retrieve_response.updated_at,
        expand_event: false,
      };

      webhooks_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('webhooks.list', () => {
    it('should successfully list webhooks.', async () => {
      webhooks_list_response = await client.webhooks.list();
      const webhook_ids = webhooks_list_response.map((webhook) => webhook.id);
      
      Array.isArray(webhooks_list_response).should.be.true;
      webhook_ids.should.contain(webhooks_create_response.id);
    });
  });

  describe('webhooks.delete', () => {
    it('should successfully delete a webhook.', async () => {
      webhooks_delete_response = await client.webhooks.delete(webhooks_create_response.id);

      (webhooks_delete_response === null).should.be.true;
    });
  });
});
