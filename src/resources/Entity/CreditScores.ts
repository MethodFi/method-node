import Resource, { IResourceError } from "../../resource";
import Configuration from "../../configuration";
import { TCreditReportBureaus } from ".";

export const CreditScoresStatuses = {
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  failed: 'failed',
};

export type TEntityCreditScoresStatuses =
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'failed';

export const CreditScoresModel = {
  vantage_4: 'vantage_4',
  vantage_3: 'vantage_3',
};

export type TCreditScoresModel =
  | 'vantage_4'
  | 'vantage_3';

export interface IEntityCreditScoresFactorsType {
  code: string,
  description: string,
}

export interface IEntityCreditScoresType {
  score: number,
  source: TCreditReportBureaus,
  model: TCreditScoresModel,
  factors: IEntityCreditScoresFactorsType[],
  created_at: string,
}

export interface IEntityCreditScoresResponse {
  id: string,
  status: TEntityCreditScoresStatuses,
  scores: IEntityCreditScoresType[] | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
}

export default class EntityCreditScores extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('credit_scores'));
  }

    /**
   * Retrieve the result of a credit score request
   * 
   * @param crs_id id of the credit score request
   * @returns IEntityCreditScoresResponse
   */

    async retrieve(crs_id: string) {
      return super._getWithId<IEntityCreditScoresResponse>(crs_id);
    }
  
    /**
     * Creates a credit score request
     * 
     * @param ent_id ent_id
     * @returns IEntityCreditScoresResponse
     */
  
    async create() {
      return super._create<IEntityCreditScoresResponse, {}>({});
    }
}