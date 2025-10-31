import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountProductListResponse } from './types';

export default class AccountProducts extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('products'));
  }

  /**
   * Retrieve an account's product list.
   * https://docs.methodfi.com/reference/accounts/products/list
   *
   * @returns Returns a map of Product names to Product objects for an Account.
   */

  async list() {
    return super._get<IResponse<IAccountProductListResponse>>();
  }
};
