import Resource from "../../resource";
import Configuration from "../../configuration";
import type { IEntityProduct, IEntityProductListResponse } from "./types";

export default class EntityProducts extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('products'));
  }

  /**
   * Retrieve an entity's product.
   * 
   * @param prd_id ID of the product.
   * @returns Returns a Product object.
   */

  async retrieve(prd_id: string) {
    return super._getWithId<IEntityProduct>(prd_id);
  }

  /**
   * Retrieve an entity's product list.
   * 
   * @returns Returns a map of Product names to Product objects for an Entity.
   */

  async list() {
    return super._get<IEntityProductListResponse>();
  }
};
