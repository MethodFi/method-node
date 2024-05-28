import Resource, { IResourceError, TResourceStatus } from "../../resource";
import Configuration from "../../configuration";
import { TCreditReportBureaus } from "./types";

export const CreditScoresModel = {
  vantage_4: 'vantage_4',
  vantage_3: 'vantage_3',
};

export type TCreditScoresModel = keyof typeof CreditScoresModel;

export interface IEntityCreditScoresFactorsType {
  code: string,
  description: string,
};

export interface IEntityCreditScoresType {
  score: number,
  source: TCreditReportBureaus,
  model: TCreditScoresModel,
  factors: IEntityCreditScoresFactorsType[],
  created_at: string,
};

export interface IEntityCreditScores {
  id: string,
  entity_id: string,
  status: TResourceStatus,
  scores: IEntityCreditScoresType[] | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
};

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
