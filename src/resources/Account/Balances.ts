import Resource, { IResourceError, TResourceStatus } from '../../resource';
import Configuration from '../../configuration';

export interface IAccountBalance {
  id: string;
  account_id: string;
  status: TResourceStatus;
  amount: number | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class AccountBalances extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('balances'));
  }

  /**
   * Retrieves results of a Balance request for an account
   * 
   * @param bal_id ID of the balance
   * @returns IAccountBalance
   */

  async retrieve(bal_id: string) {
    return super._getWithId<IAccountBalance>(bal_id);
  }

  /**
   * Creates a request to get the Balance of an account
   * 
   * @returns IAccountBalance
   */

  async create() {
    return super._create<IAccountBalance, {}>({});
  }
};