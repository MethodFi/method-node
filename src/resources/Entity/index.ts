import Resource, { IRequestConfig, IResourceListOpts } from '../../resource';
import Configuration from '../../configuration';
import EntityConnect from './Connect';
import EntityProducts from './Products';
import EntityIdentities from './Identities';
import EntityCreditScores from './CreditScores';
import EntitySubscriptions from './Subscriptions';
import EntityVerificationSession from './VerificationSessions';
import type {
  IEntity,
  IEntityAddress,
  IEntityIndividual,
  IEntityCorporation,
  IEntityReceiveOnly,
  TEntityTypes
} from './types';

export const EntityExpandableFields = {
  connect: 'connect',
  credit_score: 'credit_score',
  identity_latest_verification_session: 'identity.latest_verification_session',
  phone_latest_verification_session: 'phone.latest_verification_session',
};

export type TEntityExpandableFields = keyof typeof EntityExpandableFields;

export interface IEntityCreateOpts {
  type: TEntityTypes;
  address?: IEntityAddress | null;
  metadata?: {} | null;
};

export interface IIndividualCreateOpts extends IEntityCreateOpts {
  type: 'individual';
  individual: Partial<IEntityIndividual>;
};

export interface ICorporationCreateOpts extends IEntityCreateOpts {
  type:
  | 'c_corporation'
  | 's_corporation'
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship';
  corporation: Partial<IEntityCorporation>;
};

export interface IReceiveOnlyCreateOpts extends IEntityCreateOpts {
  type: 'receive_only';
  receive_only: IEntityReceiveOnly;
};

export interface IEntityUpdateOpts {
  address?: IEntityAddress;
  corporation?: Partial<IEntityCorporation>;
  individual?: Partial<IEntityIndividual>;
};

export interface IEntityListOpts extends IResourceListOpts {
  status?: string | null;
  type?: string | null;
};


export interface IEntityWithdrawConsentOpts {
  type: 'withdraw',
  reason: 'entity_withdrew_consent' | null,
};

export class EntitySubResources {
  connect: EntityConnect;
  creditScores: EntityCreditScores;
  identities: EntityIdentities;
  products: EntityProducts;
  subscriptions: EntitySubscriptions;
  verificationSessions: EntityVerificationSession;

  constructor(id: string, config: Configuration) {
    this.connect = new EntityConnect(config.addPath(id));
    this.creditScores = new EntityCreditScores(config.addPath(id));
    this.identities = new EntityIdentities(config.addPath(id));
    this.products = new EntityProducts(config.addPath(id));
    this.subscriptions = new EntitySubscriptions(config.addPath(id));
    this.verificationSessions = new EntityVerificationSession(config.addPath(id));
  }
};

export interface Entity {
  (id: string): EntitySubResources;
};

export class Entity extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('entities'));
  }

  protected _call(ent_id): EntitySubResources {
    return new EntitySubResources(ent_id, this.config);
  }

  /**
   * Creates an entity
   * 
   * @param opts IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts,
   * @param requestConfig Idempotency Key { idempotency_key?: string }
   * @returns Created entity (IEntity)
   */

  async create(
    opts: IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts,
    requestConfig?: IRequestConfig,
  ) {
    return super._create<IEntity, IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts>(
      opts,
      requestConfig,
    );
  }

  /**
   * Updates an entity
   * 
   * @param ent_id ent_id
   * @param opts IEntityUpdateOpts
   * @returns Updated entity (IEntity)
   */

  async update(ent_id: string, opts: IEntityUpdateOpts) {
    return super._updateWithId<IEntity, IEntityUpdateOpts>(ent_id, opts);
  }

  /**
   * Retrieves an entity by id
   * 
   * @param ent_id ent_id
   * @returns Retrieved entity (IEntity)
   */

  async retrieve<K extends TEntityExpandableFields = never>(ent_id: string, opts?: { expand: K[] }) {
    return super._getWithSubPathAndParams<{[P in keyof IEntity]: P extends K ? Exclude<IEntity[P], string> : Extract<IEntity[P], string | null>}, { expand: K[]; } | undefined>(ent_id, opts);
  }

  /**
   * Lists all entities
   * 
   * @param opts IEntityListOpts: https://docs.methodfi.com/api/core/entities/list
   * @returns IEntity[]
   */

  async list(opts?: IEntityListOpts) {
    return super._list<IEntity>(opts);
  }

  /**
   * Refresh an entity's capabilities
   * 
   * @param ent_id ent_id
   * @returns IEntity
   */

  async refreshCapabilities(ent_id: string) {
    return super._createWithSubPath<IEntity, {}>(`/${ent_id}/refresh_capabilities`, {});
  }

  /**
   * Withdraws consent for an entity
   * 
   * @param ent_id ent_id
   * @param data IEntityWithdrawConsentOpts: { type: 'withdraw', reason: 'entity_withdrew_consent' }
   * @returns Deactivated entity (IEntity)
   */

  async withdrawConsent(ent_id: string, data: IEntityWithdrawConsentOpts = { type: 'withdraw', reason: 'entity_withdrew_consent' }) {
    return super._createWithSubPath<IEntity, IEntityWithdrawConsentOpts>(
      `/${ent_id}/consent`,
      data,
    );
  }
};

export default Entity;
