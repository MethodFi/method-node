import Resource, { IResourceError, TResourceStatus } from '../../resource';
import Configuration from '../../configuration';
import { IEntityIdentityType } from './types';

export interface IEntityIdentity {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  identities: IEntityIdentityType[];
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class EntityIdentities extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('identities'));
  }

  /**
   * Retrieves an Identity request with the matched identity for an Entity.
   * 
   * @param idn_id id of the identity
   * @returns Returns an Identity object.
   */

  async retrieve(idn_id: string) {
    return super._getWithId<IEntityIdentity>(idn_id);
  }

  /**
   * Creates a new Identity request to retrieve the identity of an Entity, based off the PII that has been passed in to Method so far.
   * 
   * @returns Returns an Identity object.
   */
  
  async create() {
    return super._create<IEntityIdentity, {}>({});
  }
};
