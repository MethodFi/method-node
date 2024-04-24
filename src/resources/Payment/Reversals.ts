import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const ReversalStatuses = {
  pending_approval: 'pending_approval',
  pending: 'pending',
  processing: 'processing',
  sent: 'sent',
  failed: 'failed',
};

export type TReversalStatuses = keyof typeof ReversalStatuses;

export const ReversalDirections = {
  debit: 'debit',
  credit: 'credit',
};

export type TReversalDirections = keyof typeof ReversalDirections;

export interface IReversal {
  id: string;
  pmt_id: string;
  target_account: string;
  trace_id: string | null;
  direction: TReversalDirections;
  description: string;
  amount: number;
  status: TReversalStatuses;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IReversalUpdateOpts {
  status: TReversalStatuses;
  description?: string | null;
};

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
