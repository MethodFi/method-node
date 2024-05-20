import Resource, { IResourceError } from "../../resource";
import Configuration from "../../configuration";

export const EntityProductTypeStatuses = {
  unavailable: 'unavailable',
  available: 'available',
  restricted: 'restricted',
};

export type TEntityProductTypeStatuses = keyof typeof EntityProductTypeStatuses;

export const EntityProductType = {
  connect: 'connect',
  credit_score: 'credit_score',
  identity: 'identity',
};

export type TEntityProductType = keyof typeof EntityProductType;

export interface IEntityProduct {
  id: string;
  name: string;
  status: TEntityProductTypeStatuses;
  status_error: IResourceError | null;
  latest_request_id: string | null;
  is_subscribable: boolean;
  created_at: string;
  updated_at: string;
};

export interface IEntityProductListResponse {
  connect?: IEntityProduct;
  credit_score?: IEntityProduct;
  identity?: IEntityProduct;
};

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
