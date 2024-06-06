import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IReversal, IReversalUpdateOpts } from './types';

export default class Reversal extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('reversals'));
  }

  /**
   * Retrieve a reversal
   * 
   * @param rvs_id id of the reversal
   * @returns IReversal
   */

  async retrieve(rvs_id: string) {
    return super._getWithId<IReversal>(rvs_id);
  }

  /**
   * Lists all reversals
   * 
   * @returns IReversal[]
   */

  async list() {
    return super._list<IReversal>();
  }

  /**
   * Update a reversal
   * 
   * @param rvs_id id of the reversal
   * @param data IReversalUpdateOpts: https://docs.methodfi.com/api/core/payments/reversals/update
   * @returns IReversal
   */

  async update(rvs_id: string, data: IReversalUpdateOpts) {
    return super._updateWithId<IReversal, IReversalUpdateOpts>(rvs_id, data);
  }
};
