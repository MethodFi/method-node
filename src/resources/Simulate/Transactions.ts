import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccountTransaction } from '../Account/Transactions';

export default class SimulateTransactions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  /**
   * For Accounts that have been successfully verified, you may simulate Transactions in the dev environment.
   * 
   * @returns Returns the created Transaction.
   */

  async create() {
    return super._create<IAccountTransaction, {}>({});
  }
};
