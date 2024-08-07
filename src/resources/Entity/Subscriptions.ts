import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type {
  IEntitySubscription,
  IEntitySubscriptionCreateOpts,
  IEntitySubscriptionResponse,
  TEntitySubscriptionNames,
} from './types';

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
    return super._getWithId<IResponse<IEntitySubscription>>(sub_id);
  }

  /**
   * Returns a map of Subscriptions names to Subscription objects associated with an Entity, or an empty array if none have been created.
   * 
   * @returns Returns a map of Subscription names to Subscription objects.
   */

  async list() {
    return super._get<IResponse<IEntitySubscriptionResponse>>();
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
    return super._create<IResponse<IEntitySubscription>, IEntitySubscriptionCreateOpts>({ enroll: sub_name }, requestConfig);
  }

  /**
   * Deleting a Subscription means to unenroll an Entity from automatically receiving new Product resources.
   * 
   * @param sub_id ID of the subscription
   * @returns Returns a Subscription object.
   */

  async delete(sub_id: string) {
    return super._delete<IResponse<IEntitySubscription>>(sub_id);
  }
};
