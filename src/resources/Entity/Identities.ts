import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityIdentity } from './types';

export default class EntityIdentities extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('identities'));
  }

  /**
   * Retrieves an Identity request with the matched identity for an Entity.
   * 
   * @param idn_id ID of the identity
   * @returns Returns an Identity object.
   */

  async retrieve(idn_id: string) {
    return super._getWithId<IResponse<IEntityIdentity>>(idn_id);
  }

  /**
   * Creates a new Identity request to retrieve the identity of an Entity, based off the PII that has been passed in to Method so far.
   * 
   * @returns Returns an Identity object.
   */
  
  async create() {
    return super._create<IResponse<IEntityIdentity>, {}>({});
  }
};
