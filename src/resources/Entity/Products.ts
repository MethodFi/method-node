import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityProductListResponse } from './types';

export default class EntityProducts extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('products'));
  }

  /**
   * Retrieve an entity's product list.
   * https://docs.methodfi.com/reference/entities/products/list
   *
   * @returns Returns a map of Product names to Product objects for an Entity.
   */

  async list() {
    return super._get<IResponse<IEntityProductListResponse>>();
  }
};
