import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityVehicles } from './types';

export default class EntityVehicles extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('vehicles'));
  }

  /**
   * Retrieves a Vehicle record for an Entity.
   * https://docs.methodfi.com/reference/entities/vehicles/retrieve
   *
   * @param evhl_id ID of the Vehicle
   * @returns Returns an Entity’s Vehicle object.
   */

  async retrieve(evhl_id: string) {
    return super._getWithId<IResponse<IEntityVehicles>>(evhl_id);
  }

  /**
   * Retrieves a list of Vehicle objects for an entity.
   * https://docs.methodfi.com/reference/entities/vehicles/list
  *
   * @returns Returns a list of Vehicle objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IEntityVehicles>>(opts);
  }

  /**
   * Creates a new Vehicle request to retrieve the Entity’s vehicle.
   * https://docs.methodfi.com/reference/entities/vehicles/create
   *
   * @returns Returns an Entity’s Vehicle object.
   */

  async create() {
    return super._create<IResponse<IEntityVehicles>, {}>({});
  }
};
