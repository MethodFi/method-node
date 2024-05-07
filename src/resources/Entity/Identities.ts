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
   * Retrieve an identity
   * 
   * @param idn_id id of the identity
   * @returns IEntityIdentity
   */

  async retrieve(idn_id: string) {
    return super._getWithId<IEntityIdentity>(idn_id);
  }

  /**
   * Create a new identity request
   * 
   * @returns IEntityIdentity
   */
  
  async create() {
    return super._create<IEntityIdentity, {}>({});
  }
};
