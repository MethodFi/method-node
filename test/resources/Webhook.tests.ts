import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IWebhook } from '../../src/resources/Webhook';

should();

describe('Webhooks - core methods tests', () => {
  let webhooks_create_response: IWebhook | null = null;
  let webhooks_get_response: IWebhook | null = null;
  let webhooks_list_response: IWebhook[] | null = null;
  let webhooks_delete_response: {} | null = null;

  describe('webhooks.create', () => {
    it('should successfully create a webhook.', async () => {
      webhooks_create_response = await client.webhooks.create({
        type: 'payment.create',
        url: 'https://dev.methodfi.com',
        auth_token: Math.random().toString(),
      });

      (webhooks_create_response !== null).should.be.true;
    });
  });

  describe('webhooks.get', () => {
    it('should successfully get a webhook.', async () => {
      webhooks_get_response = await client.webhooks.retrieve(webhooks_create_response?.id || '');

      (webhooks_get_response !== null).should.be.true;
    });
  });

  describe('webhooks.list', () => {
    it('should successfully list webhooks.', async () => {
      webhooks_list_response = await client.webhooks.list();

      (webhooks_list_response !== null).should.be.true;
      Array.isArray(webhooks_list_response).should.be.true;
    });
  });

  describe('webhooks.delete', () => {
    it('should successfully delete a webhook.', async () => {
      webhooks_delete_response = await client.webhooks.delete(webhooks_create_response?.id || '');

      (webhooks_delete_response === null).should.be.true;
    });
  });
});
