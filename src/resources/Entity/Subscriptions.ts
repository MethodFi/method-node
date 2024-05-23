import Resource, { IRequestConfig } from '../../resource';
import { MethodError } from '../../errors';
import Configuration from '../../configuration';

export const EntitySubscriptionNames = {
  connect: 'connect',
  credit_score: 'credit_score',
};

export type TEntitySubscriptionNames = keyof typeof EntitySubscriptionNames;

export const EntitySubscriptionStatuses = {
  active: 'active',
  inactive: 'inactive',
};

export type TEntitySubscriptionStatuses = keyof typeof EntitySubscriptionStatuses;

export interface IEntitySubscription {
  id: string;
  name: TEntitySubscriptionNames;
  status: TEntitySubscriptionStatuses;
  latest_request_id: string | null;
  created_at: string;
  updated_at: string;
};

export interface IEntitySubscriptionResponse {
  connect?: IEntitySubscription;
  credit_score?: IEntitySubscription;
};

export interface IEntitySubscriptionCreateOpts {
  enroll: TEntitySubscriptionNames;
};

export default class EntitySubscriptions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('subscriptions'));
  }

  /**
   * Retrieves a Subscription record for an Entity.
   * 
   * @param sub_id ID of the subscription
   * 
   * @returns Returns a Subscription object.
   */

  async retrieve(sub_id: string) {
    return super._getWithId<IEntitySubscription>(sub_id);
  }

  /**
   * Returns a map of Subscriptions names to Subscription objects associated with an Entity, or an empty array if none have been created.
   * 
   * @returns Returns a map of Subscription names to Subscription objects.
   */

  async list() {
    return super._get<IEntitySubscriptionResponse>();
  }

  /**
   * Enrolls an Entity to a Subscription. Once enrolled, the Subscription name and details will be present on the response object.
   * Being enrolled in a Subscription is independent of other Subscriptions. An error won’t prevent the Entity from being enrolled in other Subscriptions.
   * 
   * @param sub_name A Subscription name to enroll the Entity in. enroll: ['connect', 'credit_score']
   * 
   * @returns Returns a map of Subscription name to either Subscription object or Error.
   */

  async create(sub_name: TEntitySubscriptionNames, requestConfig?: IRequestConfig) {
    return super._create<IEntitySubscription, IEntitySubscriptionCreateOpts>({ enroll: sub_name }, requestConfig);
  }

  /**
   * Deleting a Subscription means to unenroll an Entity from automatically receiving new Product resources.
   * 
   * @param sub_id ID of the subscription
   * @returns Returns a Subscription object.
   */

  async delete(sub_id: string) {
    return super._delete<IEntitySubscription>(sub_id);
  }
};
