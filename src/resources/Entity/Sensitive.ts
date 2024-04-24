import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IEntityKYCAddressRecordData, IEntityIdentityType } from './types';

export interface IEntitySensitiveResponse {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  phone_history: string[];
  email: string | null;
  dob: string | null;
  address: IEntityKYCAddressRecordData | null;
  address_history: IEntityKYCAddressRecordData[];
  ssn_4: string | null;
  ssn_6: string | null;
  ssn_9: string | null;
  identities: IEntityIdentityType[];
};

export default class EntitySensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sensitive'));
  }

  /**
   * Retrieve the sensitive fields of an entity
   * 
   * @param ent_id ent_id
   * @returns IEntitySensitiveResponse
   */
  
  async retrieve() {
    return super._get<IEntitySensitiveResponse>();
  }
};