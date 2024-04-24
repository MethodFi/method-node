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
   * Retrieve the result of a credit score request
   * 
   * @param crs_id id of the credit score request
   * @returns IEntityCreditScores
   */

    async retrieve(crs_id: string) {
      return super._getWithId<IEntityCreditScores>(crs_id);
    }
  
    /**
     * Creates a credit score request
     * 
     * @returns IEntityCreditScores
     */
  
    async create() {
      return super._create<IEntityCreditScores, {}>({});
    }
};
