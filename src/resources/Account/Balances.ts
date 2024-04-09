import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const AccountBalanceStatus = {
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  failed: 'failed',
};

export type TAccountBalanceStatus =
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'failed';

export interface IAccountBalance {
  id: string;
  status: TAccountBalanceStatus;
  balance: number | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export default class AccountBalances extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('balances'));
  }

  /**
   * Retrieves the balance of an account
   * 
   * @param bal_id ID of the balance
   * @returns IAccountBalance
   */

  async retrieve(bal_id: string) {
    return super._getWithId<IAccountBalance>(bal_id);
  }

  /**
   * Creates a request to get the balance of an account
   * 
   * @returns IAccountBalance
   */

  async create() {
    return super._create<IAccountBalance, {}>({});
  }
}