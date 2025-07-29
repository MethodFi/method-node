import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityConnect } from './types';

export const AccountExpandableFields = {
  sensitive: 'sensitive',
  balance: 'balance',
  card_brand: 'card_brand',
  attribute: 'attribute',
  payoff: 'payoff',
  transaction: 'transaction',
  update: 'update',
  payment_instrument: 'payment_instrument',
  latest_verification_session: 'latest_verification_session',
} as const;

type AccountFieldKey = typeof AccountExpandableFields[keyof typeof AccountExpandableFields];

export type ExpandField = 'accounts' | `accounts.${AccountFieldKey}`;

export interface IExpandableOpts {
  expand?: ExpandField[];
}

export interface IConnectListOpts extends IResourceListOpts, IExpandableOpts {}

export const AccountProductsEligibleForAutomaticExecution = [
  'attribute',
  'balance',
  'card_brand',
  'update',
  'payoff',
] as const;

export const AccountSubscriptionsEligibleForAutomaticExecution = [
  'card_brand',
  'update',
  'update.snapshot',
  'transaction',
] as const;

export type AccountProduct = typeof AccountProductsEligibleForAutomaticExecution[number];
export type AccountSubscription = typeof AccountSubscriptionsEligibleForAutomaticExecution[number];

export interface IConnectCreateOpts {
  products?: AccountProduct[];
  subscriptions?: AccountSubscription[];
}


export default class EntityConnect extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('connect'));
  }

  /**
   * Retrieves a Connect record for an Entity.
   *
   * @param cxn_id ID of the entity connection
   * @returns Returns a Connect object.
   */

  async retrieve(cxn_id: string, opts: IExpandableOpts = {}) {
    return super._getWithSubPathAndParams<IResponse<IEntityConnect>>(cxn_id, opts);
  }

  /**
   * Retrieves a list of Connect objects for an entity.
   *
   * @returns Returns a list of Connect objects.
   */

  async list(opts?: IConnectListOpts) {
    return super._list<IResponse<IEntityConnect>>(opts);
  }

  /**
   * Creates a new Connect request to connect all liability accounts for the Entity.
   *
   * @returns Returns a Connect object.
   */

  async create(opts: IConnectCreateOpts = {}, params: IExpandableOpts = {}) {
    return super._create<IResponse<IEntityConnect>, IConnectCreateOpts, IExpandableOpts>(opts, params);
  }
};
