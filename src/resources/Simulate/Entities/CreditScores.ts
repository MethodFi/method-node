import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type {
  IEntityCreditScores,
  IEntityCreditScoresType,
} from '../../Entity';

export class SimulateCreditScoresInstance extends Resource {
  constructor(crs_id: string, config: Configuration) {
    super(config.addPath(crs_id));
  }

  /**
   * For Entities that have been successfully verified, you may simulate Credit Scores in the dev environment.
   *
   * @returns Returns the created Credit Score.
   */
  async create(opts: { scores: IEntityCreditScoresType[] }) {
    return super._create<IResponse<IEntityCreditScores>, { scores: IEntityCreditScoresType[] }>(opts);
  }
}

export default interface SimulateCreditScores {
  (crs_id: string): SimulateCreditScoresInstance;
}

export default class SimulateCreditScores extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('credit_scores'));
  }

  protected _call(crs_id: string): SimulateCreditScoresInstance {
    return new SimulateCreditScoresInstance(crs_id, this.config);
  }
}
