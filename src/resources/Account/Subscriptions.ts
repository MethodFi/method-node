import Resource from '../../resource';
import Configuration from '../../configuration';

export const AccountSubscriptionTypes = {
  transactions: 'transactions',
  update: 'update',
  update_snapshot: 'update.snapshot',
} as const;

export type TAccountSubscriptionTypes = typeof AccountSubscriptionTypes[keyof typeof AccountSubscriptionTypes];

export const AccountSubscriptionStatuses = {
  active: 'active',
};

export type TAccountSubscriptionStatuses = keyof typeof AccountSubscriptionStatuses;

export interface IAccountSubscription {
  id: string;
  name: TAccountSubscriptionTypes;
  status: TAccountSubscriptionStatuses;
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
   * @param data IAccountSubscriptionCreateOpts
   * @returns IAccountSubscriptionsResponse
   */

  async create(data: IAccountSubscriptionCreateOpts) {
    return super._create<IAccountSubscriptionsResponse, IAccountSubscriptionCreateOpts>(
      data
    )
  }
};
