// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../../common/types';
import type { TWebhookCreateOptions, TWebhookResponse } from './types';
import get_idempotency_key from '../../utils/resource_config';
import with_error_handler from '../../utils/with_error_handler';

export default class Webhooks {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TWebhookCreateOptions, config: TResourceCreationConfig = {}): Promise<TWebhookResponse> {
    return with_error_handler(async () => {
      const headers = { 'Idempotency-Key': get_idempotency_key(opts, config) };
      return (await this.axios_instance.post('/webhooks', opts, { headers })).data.data;
    });
  }

  async delete(webhook_id: string): Promise<null> {
    return with_error_handler(async () => {
      return (await this.axios_instance.delete(`/webhooks/${webhook_id}`)).data.data;
    });
  }

  async get(webhook_id: string): Promise<TWebhookResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get(`/webhooks/${webhook_id}`)).data.data;
    });
  }

  async list(): Promise<Array<TWebhookResponse>> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get('/webhooks')).data.data;
    });
  }
}
