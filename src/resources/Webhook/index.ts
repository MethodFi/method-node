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
  transaction_create: 'transaction.create',
  transaction_update: 'transaction.update',
  report_create: 'report.create',
  report_update: 'report.update',
  credit_score_create: 'credit_score.create',
  credit_score_update: 'credit_score.update',

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
  | 'transaction.create'
  | 'transaction.update'
  | 'report.create'
  | 'report.update'
  | 'credit_score.create'
  | 'credit_score.update'

  // Deprecated
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

  /**
   * Returns the webhook associated with the id.
   * 
   * @param whk_id id of the webhook
   * @returns IWebhook
   */

  async retrieve(whk_id: string) {
    return super._getWithId<IWebhook>(whk_id);
  }

  /**
   * Deletes the webhook associated with the id.
   * 
   * @param whk_id id of the webhook
   * @returns IWebhook
   */

  async delete(whk_id: string) {
    return super._delete<IWebhook>(whk_id);
  }

  /**
   * Returns all the webhook associated with your team, or an empty array is none have been created.
   * 
   * @returns IWebhook[]
   */

  async list() {
    return super._list<IWebhook>();
  }

  /**
   * Creates a new webhook for a specific type and url. Your application will be notified of updates to the chosen event type.
   * 
   * @param opts IWebhookCreateOpts: https://docs.methodfi.com/api/core/webhooks/create
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns IWebhook
   */

  async create(opts: IWebhookCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IWebhook, IWebhookCreateOpts>(opts, requestConfig);
  }
};
