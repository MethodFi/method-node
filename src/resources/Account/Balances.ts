import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccountBalance } from './types';

export default class AccountBalances extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('balances'));
  }

  /**
   * Retrieve a Balance record for an Account.
   * 
   * @param bal_id ID of the balance
   * @returns Returns a Balance object.
   */

  async retrieve(bal_id: string) {
    return super._getWithId<IAccountBalance>(bal_id);
  }

  // TODO: Add back in when we have a list endpoint
  // /**
  //  * Retrieves a list of Balance objects for an account.
  //  * 
  //  * @returns Returns a list of Balances.
  //  */

  // async list(opts?: IResourceListOpts) {
  //   return super._list<IAccountBalance>(opts);
  // }

  /**
   * Creates a new Balance request to retrieve the Account’s balance from the financial institution.
   * 
   * @returns Returns a Balance object.
   */

  async create() {
    return super._create<IAccountBalance, {}>({});
  }
};
