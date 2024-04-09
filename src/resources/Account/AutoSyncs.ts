import Resource from '../../resource';
import Configuration from '../../configuration';
import { IAccount } from './types';

export default class AccountAutoSyncs extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sync_enrollment'));
  }

  /**
   * Enrolls an account in auto syncs
   * 
   * @param acc_id id of the account
   * @returns IAccount
   */

  async create() {
    return super._create<IAccount, {}>({});
  }

  /**
   * Un-enrolls an account in auto syncs
   * 
   * @param acc_id id of the account
   * @returns IAccount
   */

  async delete() {
    return super._delete<IAccount>('');
  }
};