import Resource from '../../resource';
import Configuration from '../../configuration';
import type { TAccountSubscriptionTypes } from './types';

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
  transactions?: IAccountSubscription;
  update?: IAccountSubscription;
  'update.snapshot'?: IAccountSubscription;
};

export interface IAccountSubscriptionCreateOpts {
  enroll: TAccountSubscriptionTypes;
};

export default class AccountSubscriptions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('subscriptions'));
  }

  /**
   * Enrolls an Account to a list of Subscriptions. Once enrolled, the Subscription name and details will be present on the response object.
   * 
   * Note: Subscription requests are processed individually, meaning the success or failure of one subscription does not affect others. The response object will detail any errors encountered.
   * 
   * @param data IAccountSubscriptionCreateOpts: https://docs-v2.methodfi.com/reference/accounts/subscriptions/create
   * @returns Returns a map of Subscription name to Subscription object.
   */

  async create(sub_name: TAccountSubscriptionTypes) {
    return super._create<IAccountSubscription, IAccountSubscriptionCreateOpts>(
      { enroll: sub_name }
    )
  }

  /**
   * Returns a map of Subscriptions names to Subscription objects associated with an Account, or an empty array if none have been created.
   * 
   * @returns Returns a map of Subscription names to Subscription objects.
   */

  async list() {
    return super._get<IAccountSubscriptionsResponse>();
  }

  /**
   * Retrieves a Subscription record for an Account.
   * 
   * @param sub_id ID of the Subscription
   * @returns IAccountSubscription
   */

  async retrieve(sub_id: string) {
    return super._getWithId<IAccountSubscription>(sub_id);
  }

  /**
   * Deleting a Subscription means to unsubscribe or unenroll an Account from automatically receiving new Product resources.
   * 
   * @param sub_id ID of the Subscription
   * @returns Returns a Subscription object.
   */

  async delete(sub_id: string) {
    return super._delete<IAccountSubscription>(sub_id);
  }
};
