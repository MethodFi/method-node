import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { SimulateEntityAttributesOpts } from '../types';

export class SimulateAttributesInstance extends Resource {
  constructor(entity_id: string, config: Configuration) {
    super(config.addPath(entity_id));
  }

  /**
   * For Entities that have been successfully verified, you may simulate Attributes in the dev environment.
   * https://docs.methodfi.com/reference/simulations/attributes/create
   *
   * @param opts SimulateEntityAttributesOpts
   */
  async create(opts: SimulateEntityAttributesOpts) {
    return super._create<IResponse<null>, SimulateEntityAttributesOpts>(opts); 
  }
}

export interface SimulateAttributes {
  (entity_id: string): SimulateAttributesInstance;
}

export default class SimulateAttributes extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('attributes'));
  }

  protected _call(entity_id: string): SimulateAttributesInstance {
    return new SimulateAttributesInstance(entity_id, this.config);
  }
}
