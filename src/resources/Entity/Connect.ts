import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityConnect } from './types';

export default class EntityConnect extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('connect'));
  }

  /**
   * Retrieves a Connect record for an Entity.
   *
   * @param cxn_id ID of the entity connection
   * @returns Returns a Connect object.
   */

  async retrieve(cxn_id: string) {
    return super._getWithId<IResponse<IEntityConnect>>(cxn_id);
  }

  /**
   * Retrieves a list of Connect objects for an entity.
   *
   * @returns Returns a list of Connect objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IEntityConnect>>(opts);
  }

  /**
   * Creates a new Connect request to connect all liability accounts for the Entity.
   *
   * @returns Returns a Connect object.
   */

  async create() {
    return super._create<IResponse<IEntityConnect>, {}>({});
  }
};
