import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { IEntityCreditScores, IEntityCreditScoresType } from '../../Entity';

export interface ISimulateCreditScoresUpdateOpts {
  scores: Partial<IEntityCreditScoresType>[];
};

export default class SimulateCreditScores extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('credit_scores'));
  }

  /**
   * Updates a created CreditScore with custom values.
   *
   * @param id ID of the CreditScore
   * @param data The desired credit score values.
   * @returns Returns the updated CreditScore.
   */

  async update(id: string, data: ISimulateCreditScoresUpdateOpts) {
    return super._postWithId<IResponse<IEntityCreditScores>, ISimulateCreditScoresUpdateOpts>(id, data);
  }
};
