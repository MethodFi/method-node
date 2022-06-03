import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const ReversalStatuses = {
  pending_approval: 'pending_approval',
  pending: 'pending',
  processing: 'processing',
  sent: 'sent',
  failed: 'failed',
};

export type TReversalStatuses =
  | 'pending_approval'
  | 'pending'
  | 'processing'
  | 'sent'
  | 'failed';

export const ReversalDirections = {
  debit: 'debit',
  credit: 'credit',
};

export type TReversalDirections =
  | 'debit'
  | 'credit';

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
}

export interface IReversalUpdateOpts {
  status: TReversalStatuses;
  description?: string | null;
}

export default class Reversal extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('reversals'));
  }

  async get(id: string) {
    return super._getWithId<IReversal>(id);
  }

  async list() {
    return super._list<IReversal>();
  }

  async update(id: string, data: IReversalUpdateOpts) {
    return super._updateWithId<IReversal, IReversalUpdateOpts>(id, data);
  }
}
