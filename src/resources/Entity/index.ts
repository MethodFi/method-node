import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import EntityConnect from './Connect';
import EntityProducts from './Products';
import EntityIdentities from './Identities';
import EntityCreditScores from './CreditScores';
import EntityAttributes from './Attributes';
import EntitySubscriptions from './Subscriptions';
import EntityVerificationSession from './VerificationSessions';
import type {
  IEntity,
  IEntityListOpts,
  IEntityUpdateOpts,
  IEntityWithdrawConsentOpts,
  IIndividualCreateOpts,
  ICorporationCreateOpts,
  TEntityExpandableFields,
} from './types';

export class EntitySubResources {
  connect: EntityConnect;
  creditScores: EntityCreditScores;
  identities: EntityIdentities;
  attributes: EntityAttributes;
  products: EntityProducts;
  subscriptions: EntitySubscriptions;
  verificationSessions: EntityVerificationSession;

  constructor(id: string, config: Configuration) {
    this.connect = new EntityConnect(config.addPath(id));
    this.creditScores = new EntityCreditScores(config.addPath(id));
    this.identities = new EntityIdentities(config.addPath(id));
    this.attributes = new EntityAttributes(config.addPath(id));
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

  protected _call(ent_id: string): EntitySubResources {
    return new EntitySubResources(ent_id, this.config);
  }

  /**
   * Retrieves an entity by id
   *
   * @param ent_id ent_id
   * @returns Returns the Entity associated with the ID.
   */

  async retrieve<K extends TEntityExpandableFields = never>(ent_id: string, opts?: { expand: K[] }) {
    return super._getWithSubPathAndParams<IResponse<{
      [P in keyof IEntity]: P extends K
        ? Exclude<IEntity[P], string>
        : IEntity[P]
      }>, { expand: K[]; } | undefined>(ent_id, opts);
  }

  /**
   * Returns all the Entities associated with your team, or an empty array if none have been created.
   *
   * @param opts IEntityListOpts: https://docs.methodfi.com/api/core/entities/list
   * @returns Returns a list of Entities.
   */

  async list<K extends TEntityExpandableFields = never>(opts?: IEntityListOpts<K>) {
    return super._list<IResponse<{
      [P in keyof IEntity]: P extends K
      ? Exclude<IEntity[P], string>
      : IEntity[P]
    }>, IEntityListOpts<K> | undefined>(opts);
  }

  /**
   * Creates an entity
   *
   * @param opts IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts,
   * @param requestConfig Idempotency Key { idempotency_key?: string }
   * @returns Created entity (IEntity)
   */

  async create(
    opts: IIndividualCreateOpts | ICorporationCreateOpts,
    requestConfig?: IRequestConfig,
  ) {
    return super._create<IResponse<IEntity>, IIndividualCreateOpts | ICorporationCreateOpts>(
      opts,
      requestConfig,
    );
  }

  /**
   * Updates an Entity with the parameters sent.
   *
   * Note: Once an Entity’s property has been set, that property can no longer be updated.
   *
   * @param ent_id ent_id
   * @param opts IEntityUpdateOpts
   * @returns Returns the entity with the updated fields.
   */

  async update(ent_id: string, opts: IEntityUpdateOpts) {
    return super._updateWithId<IResponse<IEntity>, IEntityUpdateOpts>(ent_id, opts);
  }

  /**
   * Withdraws consent for an entity
   *
   * @param ent_id ent_id
   * @param data IEntityWithdrawConsentOpts: { type: 'withdraw', reason: 'entity_withdrew_consent' }
   * @returns Deactivated entity (IEntity)
   */

  async withdrawConsent(ent_id: string, data: IEntityWithdrawConsentOpts = { type: 'withdraw', reason: 'entity_withdrew_consent' }) {
    return super._createWithSubPath<IResponse<IEntity>, IEntityWithdrawConsentOpts>(
      `/${ent_id}/consent`,
      data,
    );
  }
};

export default Entity;
export * from './types';
