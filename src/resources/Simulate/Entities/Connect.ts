import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { SimulateEntityConnectOpts } from '../types';

export class SimulateConnectInstance extends Resource {
  constructor(entity_id: string, config: Configuration) {
    super(config.addPath(entity_id));
  }

  /**
   * For Entities that have been successfully verified, you may simulate Connect in the dev environment.
   * https://docs.methodfi.com/reference/simulations/connect/create
   *
   * @param opts SimulateEntityConnectOpts
   */
  async create(opts: SimulateEntityConnectOpts) {
    return super._create<IResponse<null>, SimulateEntityConnectOpts>(opts); 
  }
}

export interface SimulateConnect {
  (entity_id: string): SimulateConnectInstance;
}

export default class SimulateConnect extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('connect'));
  }

  protected _call(entity_id: string): SimulateConnectInstance {
    return new SimulateConnectInstance(entity_id, this.config);
  }
}
