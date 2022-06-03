import Resource, { IRequestConfig } from '../../resource';
import Configuration from '../../configuration';

export const WebhookTypes = {
  payment_create: 'payment.create',
  payment_update: 'payment.update',
  account_create: 'account.create',
  account_update: 'account.update',
  entity_update: 'entity.update',
  entity_create: 'entity.create',
  account_verification_create: 'account_verification.create',
  account_verification_update: 'account_verification.update',
  payment_reversal_create: 'payment_reversal.create',
  payment_reversal_update: 'payment_reversal.update',
  connection_create: 'connection.create',
  connection_update: 'connection.update',

  // Deprecated
  account_verification_sent: 'account_verification.sent',
  account_verification_returned: 'account_verification.returned',
}

export type TWebhookTypes =
  | 'payment.create'
  | 'payment.update'
  | 'account.create'
  | 'account.update'
  | 'entity.update'
  | 'entity.create'
  | 'account_verification.create'
  | 'account_verification.update'
  | 'payment_reversal.create'
  | 'payment_reversal.update'
  | 'connection.create'
  | 'connection.update'
  | 'account_verification.sent'
  | 'account_verification.returned';

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

export default class Webhook extends Resource {
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

  async create(opts: IWebhookCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IWebhook, IWebhookCreateOpts>(opts, requestConfig);
  }
};
