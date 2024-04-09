import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const AccountSubscriptionTypes = {
  transactions: 'transactions',
}

export type TAccountSubscriptionTypes = 
  | 'transactions';

export interface IAccountSubscription {
  id: string;
  name: TAccountSubscriptionTypes;
  status: string;
  latest_transaction_id: string;
  created_at: string;
  updated_at: string;
};

export interface IAccountSubscriptionsResponse {
  transactions?: {
    subscription: IAccountSubscription;
  };
};

export interface IAccountSubscriptionCreateOpts {
  enroll: TAccountSubscriptionTypes[];
};

export default class AccountSubscriptions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('subscriptions'));
  }

  /**
   * Creates a subscription for an account
   * 
   * @param id ID of the account
   * @param data IAccountSubscriptionCreateOpts
   * @returns IAccountSubscriptionsResponse
   */

  async create(id: string, data: IAccountSubscriptionCreateOpts) {
    return super._createWithSubPath<IAccountSubscriptionsResponse, IAccountSubscriptionCreateOpts>(
      `/${id}/subscriptions`,
      data
    )
  }
}