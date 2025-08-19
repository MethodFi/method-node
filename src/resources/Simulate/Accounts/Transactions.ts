import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { IAccountTransaction } from '../../Account';

export default class SimulateTransactions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  /**
   * For Accounts that have been successfully verified, you may simulate Transactions in the dev environment.
   * https://docs.methodfi.com/reference/simulations/transactions/create
   *
   * @returns Returns the created Transaction.
   */

  async create() {
    return super._create<IResponse<IAccountTransaction>, {}>({});
  }
};
