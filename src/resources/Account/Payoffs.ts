import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountPayoff } from './types';

export default class AccountPayoffs extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payoffs'));
  }

  /**
   * Retrieve a Payoff record for an Account.
   * https://docs.methodfi.com/reference/accounts/payoffs/retrieve
   *
   * @param pyf_id ID of the payoff
   * @returns Returns a Payoff object.
   */

  async retrieve(pyf_id: string) {
    return super._getWithId<IResponse<IAccountPayoff>>(pyf_id);
  }

  /**
   * Retrieves a list of Payoff requests for a specific account.
   * https://docs.methodfi.com/reference/accounts/payoffs/list
   *
   * @returns Returns a list of Payoffs.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountPayoff>>(opts);
  }

  /**
   * Creates a new Payoff request to retrieve a payoff quote from the Account’s financial institution / lender.
   * https://docs.methodfi.com/reference/accounts/payoffs/create
   *
   * @returns Returns a Payoff object.
   */

  async create() {
    return super._create<IResponse<IAccountPayoff>, {}>({});
  }
};
