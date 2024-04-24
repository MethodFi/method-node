import Resource, { IResourceError, TResourceStatus } from "../../resource";
import Configuration from "../../configuration";

export interface IAccountPayoff {
  id: string,
  status: TResourceStatus,
  amount: number | null,
  term: number | null,
  per_diem_amount: number | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
};

export default class AccountPayoffs extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payoffs'));
  }

  /**
   * Retrieves results of a payoff request for an account
   * 
   * @param pyf_id payoff id
   * @returns AccountPayoff object
   */

  async retrieve(pyf_id: string) {
    return super._getWithId<IAccountPayoff>(pyf_id);
  }

  /**
   * Creates a payoff request for an account
   * 
   * @returns AccountPayoff object
   */

  async create() {
    return super._create<IAccountPayoff, {}>({});
  }
};
