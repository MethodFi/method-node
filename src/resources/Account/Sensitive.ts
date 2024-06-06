import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccountSensitive, IAccountSensitiveCreateOpts } from './types';

export default class AccountSensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sensitive'));
  }
  
  /**
   * Retrieve a Sensitive record for an Account.
   * 
   * @param astv_id ID of the Sensitive object
   * @returns A Sensitive object
   */

  async retrieve(astv_id: string) {
    return super._getWithId<IAccountSensitive>(astv_id);
  }

  /**
   * Creates a new Sensitive request to retrieve sensitive Account information.
   * 
   * @param data Sensitive fields to expand in the response.
   * @returns A Sensitive object
   */

  async create(data: IAccountSensitiveCreateOpts) {
    return super._create<IAccountSensitive, IAccountSensitiveCreateOpts>(data);
  }
};
