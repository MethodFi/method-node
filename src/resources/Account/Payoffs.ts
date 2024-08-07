import Resource from "../../resource";
import Configuration, { IResponse } from "../../configuration";
import type { IAccountPayoff } from "./types";

export default class AccountPayoffs extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payoffs'));
  }

  /**
   * Retrieve a Payoff record for an Account.
   * 
   * @param pyf_id ID of the payoff
   * @returns Returns a Payoff object.
   */

  async retrieve(pyf_id: string) {
    return super._getWithId<IResponse<IAccountPayoff>>(pyf_id);
  }

  // TODO: Add back in when we have a list endpoint
  // /**
  //  * Retrieves a list of Payoff requests for a specific account.
  //  * 
  //  * @returns Returns a list of Payoffs.
  //  */

  // async list(opts?: IResourceListOpts) {
  //   return super._list<IAccountPayoff>(opts);
  // }

  /**
   * Creates a new Payoff request to retrieve a payoff quote from the Account’s financial institution / lender.
   * 
   * @returns Returns a Payoff object.
   */

  async create() {
    return super._create<IResponse<IAccountPayoff>, {}>({});
  }
};
