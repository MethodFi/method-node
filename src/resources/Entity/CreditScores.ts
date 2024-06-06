import Resource from "../../resource";
import Configuration from "../../configuration";
import type { IEntityCreditScores } from "./types";

export default class EntityCreditScores extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('credit_scores'));
  }

  /**
   * Retrieves a Credit Score record for an Entity.
   * 
   * @param crs_id ID of the CreditScore
   * @returns Returns an Entity’s CreditScore object.
   */

  async retrieve(crs_id: string) {
    return super._getWithId<IEntityCreditScores>(crs_id);
  }

  /**
   * Creates a new Credit Score request to retrieve the Entity’s credit score.
   * 
   * @returns Returns an Entity’s CreditScore object.
   */

  async create() {
    return super._create<IEntityCreditScores, {}>({});
  }
};
