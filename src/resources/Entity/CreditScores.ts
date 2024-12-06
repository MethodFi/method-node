import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityCreditScores } from './types';

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
    return super._getWithId<IResponse<IEntityCreditScores>>(crs_id);
  }

  /**
   * Retrieves a list of CreditScore objects for an entity.
   *
   * @returns Returns a list of CreditScore objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IEntityCreditScores>>(opts);
  }

  /**
   * Creates a new Credit Score request to retrieve the Entity’s credit score.
   *
   * @returns Returns an Entity’s CreditScore object.
   */

  async create() {
    return super._create<IResponse<IEntityCreditScores>, {}>({});
  }
};
