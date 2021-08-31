// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../types';
import type { TWebhookCreateOptions, TWebhookResponse } from './types';

export default class Webhooks {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TWebhookCreateOptions): Promise<TWebhookResponse> {
    return (await this.axios_instance.post('/webhooks', opts)).data.data;
  }

  async delete(webhook_id: string): Promise<TWebhookResponse> {
    return (await this.axios_instance.delete(`/webhooks/${webhook_id}`)).data.data;
  }

  async get(webhook_id: string): Promise<TWebhookResponse> {
    return (await this.axios_instance.get(`/webhooks/${webhook_id}`)).data.data;
  }

  async list(): Promise<Array<TWebhookResponse>> {
    return (await this.axios_instance.get('/webhooks')).data.data;
  }
}
