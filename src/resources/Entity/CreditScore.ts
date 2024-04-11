import Resource from "../../resource";
import Configuration from "../../configuration";

export interface IEntityGetCreditScoreResponse {
  score: number,
  updated_at: string,
}

export default class EntityCreditScore extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('credit_score'));
  }

  /**
   * Retrieve an entity's credit score
   * 
   * @param ent_id ent_id
   * @returns IEntityGetCreditScoreResponse
   */

  async retrieve() {
    return super._get<IEntityGetCreditScoreResponse>();
  }
}