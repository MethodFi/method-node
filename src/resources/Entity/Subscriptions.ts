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
  last_request_id: string | null;
  created_at: string;
  updated_at: string;
};

export interface IEntitySubscriptionCreateResponseOpts {
  subscription?: IEntitySubscription;
  error?: Partial<MethodError>;
};

export interface IEntitySubscriptionCreateResponse {
  connect?: IEntitySubscriptionCreateResponseOpts;
  credit_score?: IEntitySubscriptionCreateResponseOpts;
};

export interface IEntitySubscriptionCreateOpts {
  enroll: TEntitySubscriptionNames[];
};

export interface IEntitySubscriptionListResponse {
  connect?: IEntitySubscription;
  credit_score?: IEntitySubscription;
  [key: string]: IEntitySubscription;
};

export default class EntitySubscriptions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('subscriptions'));
  }

  /**
   * Enrolls an Entity to a list of Subscriptions. Once enrolled, the Subscription name and details will be present on the response object.
   * Being enrolled in a Subscription is independent of other Subscriptions. An error won’t prevent the Entity from being enrolled in other Subscriptions.
   * 
   * @param opts A list of Subscription names to enroll the Entity in. enroll: ['connect', 'credit_score']
   * 
   * @returns Returns a map of Subscription name to either Subscription object or Error.
   */

  async create(opts: IEntitySubscriptionCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IEntitySubscriptionCreateResponse, IEntitySubscriptionCreateOpts>(opts, requestConfig);
  }

  /**
   * Retrieve a subscription by id
   * 
   * @param sub_id ID of the subscription
   * 
   * @returns Returns a Subscription object.
   */

  async retrieve(sub_id: string) {
    return super._getWithId<IEntitySubscription>(sub_id);
  }

  /**
   * Retrieve an entity's subscription list
   * 
   * @returns Returns a map of Subscription names to Subscription objects.
   */

  async list() {
    return super._get<IEntitySubscriptionListResponse>();
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
