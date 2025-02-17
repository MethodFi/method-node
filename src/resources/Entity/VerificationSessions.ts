import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type {
  IEntityVerificationSession,
  IEntityVerificationSessionCreateOpts,
  IEntityVerificationSessionUpdateOpts,
} from './types';

export default class EntityVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Retrieves a EntityVerificationSession for an entity.
   *
   * @param evf_id ID of the verification session.
   * @returns Returns an EntityVerificationSession object.
   */

  async retrieve(evf_id: string) {
    return super._getWithId<IResponse<IEntityVerificationSession>>(evf_id);
  }

  /**
   * Retrieves a list of VerificationSession objects for an entity.
   *
   * @returns Returns a list of VerificationSession objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IEntityVerificationSession>>(opts);
  }

  /**
   * Create a verification session.
   *
   * @param data IEntityVerificationSessionCreateOpts
   * @returns Returns an EntityVerificationSession object.
   */

  async create(data: IEntityVerificationSessionCreateOpts) {
    return super._create<IResponse<IEntityVerificationSession>, IEntityVerificationSessionCreateOpts>(data);
  }

  /**
   * Update a verification session
   *
   * @param evf_id ID of the verification session.
   * @param data IEntityVerificationSessionUpdateOpts
   * @returns Returns an EntityVerificationSession object.
   */

  async update(evf_id: string, data: IEntityVerificationSessionUpdateOpts) {
    return super._updateWithId<IResponse<IEntityVerificationSession>, IEntityVerificationSessionUpdateOpts>(evf_id, data);
  }
};
