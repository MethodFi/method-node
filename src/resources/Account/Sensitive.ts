import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountSensitive, IAccountSensitiveCreateOpts } from './types';

export default class AccountSensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sensitive'));
  }

  /**
   * Retrieve a Sensitive record for an Account.
   * https://docs.methodfi.com/reference/accounts/sensitive/retrieve
   *
   * @param astv_id ID of the Sensitive object
   * @returns A Sensitive object
   */

  async retrieve(astv_id: string) {
    return super._getWithId<IResponse<IAccountSensitive>>(astv_id);
  }

  /**
   * Retrieves a list of Sensitive objects for an account.
   * https://docs.methodfi.com/reference/accounts/sensitive/list
   *
   * @returns Returns a list of Sensitive objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountSensitive>>(opts);
  }

  /**
   * Creates a new Sensitive request to retrieve sensitive Account information.
   * https://docs.methodfi.com/reference/accounts/sensitive/create
   *
   * @param data Sensitive fields to expand in the response.
   * @returns A Sensitive object
   */

  async create(data: IAccountSensitiveCreateOpts) {
    return super._create<IResponse<IAccountSensitive>, IAccountSensitiveCreateOpts>(data);
  }
};
