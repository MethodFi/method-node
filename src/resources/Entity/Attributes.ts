import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityAttributes } from './types';

export default class EntityAttributes extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('attributes'));
  }

  /**
   * Retrieves an Attributes record for an Entity.
   *
   * @param attr_id ID of the Attribute
   * @returns Returns an Entity’s Attribute object.
   */

  async retrieve(attr_id: string) {
    return super._getWithId<IResponse<IEntityAttributes>>(attr_id);
  }

  /**
   * Creates a new Attributes request to retrieve the Entity’s attributes.
   *
   * @returns Returns an Entity’s Attributes object.
   */

  async create() {
    return super._create<IResponse<IEntityAttributes>, {}>({});
  }
};