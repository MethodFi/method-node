import Resource, { IResourceError } from "../../resource";
import Configuration from "../../configuration";

export const AccountPayoffStatuses = {
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  failed: 'failed',
};

export type TAccountPayoffStatuses = 
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'failed';

export interface IAccountPayoff {
  id: string,
  status: TAccountPayoffStatuses,
  amount: number | null,
  term: number | null,
  per_diem_amount: number | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
}

export default class AccountPayoffs extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payoffs'));
  }

    /**
   * Retrieves results of a payoff request for an account
   * 
   * @param pyf_id payoff id
   * @returns IAccountPayoff
   */

    async retrieve(pyf_id: string) {
      return super._getWithId<IAccountPayoff>(pyf_id);
    }
  
    /**
     * Creates a payoff request for an account
     * 
     * @param id acc_id of the account
     * @returns IAccountPayoff
     */
  
    async create() {
      return super._create<IAccountPayoff, {}>({});
    }
}