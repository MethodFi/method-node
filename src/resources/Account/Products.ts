import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountProduct, IAccountProductListResponse } from './types';

export default class AccountProducts extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('products'));
  }

  /**
   * Retrieve an account's product.
   *
   * @param prd_id ID of the product.
   * @returns Returns a Product object.
   */

  async retrieve(prd_id: string) {
    return super._getWithId<IResponse<IAccountProduct>>(prd_id);
  }

  /**
   * Retrieve an account's product list.
   *
   * @returns Returns a map of Product names to Product objects for an Account.
   */

  async list() {
    return super._get<IResponse<IAccountProductListResponse>>();
  }
};
