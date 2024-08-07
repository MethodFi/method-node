import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountTransaction } from './types';

export default class AccountTransactions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  /**
   * Retrieve a Transaction object for an Account.
   * 
   * @param txn_id ID of the transaction
   * @returns Returns a Transaction object.
   */

  async retrieve(txn_id: string) {
    return super._getWithId<IResponse<IAccountTransaction>>(txn_id);
  }

  /**
   * Retrieve a list of Transactions objects for a specific Account.
   * 
   * @returns Returns a list of transactions for the account.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountTransaction>, IResourceListOpts>(opts);
  }
};
