import Resource from '../../../resource';
import Configuration from '../../../configuration';
import SimulateCreditScores from './CreditScores';

export class SimulateEntitiesSubResources {
  creditScores: SimulateCreditScores;
  constructor(ent_id: string, config: Configuration) {
    this.creditScores = new SimulateCreditScores(config.addPath(ent_id));
  }
};

export interface SimulateEntities {
  (ent_id: string): SimulateEntitiesSubResources;
};

export class SimulateEntities extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('entities'));
  }

  protected _call(ent_id: string): SimulateEntitiesSubResources {
    return new SimulateEntitiesSubResources(ent_id, this.config);
  }
};

export default SimulateEntities;
