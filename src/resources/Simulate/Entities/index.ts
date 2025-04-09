import Resource from '../../../resource';
import Configuration from '../../../configuration';
import SimulateCreditScores from './CreditScores';

export class SimulateEntitiesSubResources {
  creditScores: SimulateCreditScores;
  constructor(entity_id: string, config: Configuration) {
    this.creditScores = new SimulateCreditScores(config.addPath(entity_id));
  }
}

export interface SimulateEntities {
  (entity_id: string): SimulateEntitiesSubResources;
}

export class SimulateEntities extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('entities'));
  }

  protected _call(entity_id: string): SimulateEntitiesSubResources {
    return new SimulateEntitiesSubResources(entity_id, this.config);
  }
}

export default SimulateEntities;
