import Resource from '../../resource';
import Configuration from '../../configuration';

export const WebhookTypes = {
  payment_create: 'payment.create',
  payment_update: 'payment.update',
}

export type TWebhookTypes =
  | 'payment.create'
  | 'payment.update';

export interface IWebhook {
  id: string;
  type: TWebhookTypes;
  url: string;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
}

export interface IWebhookCreateOpts {
  type: TWebhookTypes;
  url: string;
  auth_token?: string;
  metadata?: {};
}

export default class Webhook extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('webhooks'));
  }

  async get(id: string) {
    return super._getWithId<IWebhook>(id);
  }

  async delete(id: string) {
    return super._delete<IWebhook>(id);
  }

  async list() {
    return super._list<IWebhook>();
  }

  async create(opts: IWebhookCreateOpts) {
    return super._create<IWebhook, IWebhookCreateOpts>(opts);
  }
};
