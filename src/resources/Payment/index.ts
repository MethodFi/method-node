import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import Reversal from '../Reversal';

export const PaymentStatuses = {
  pending: 'pending',
  canceled: 'canceled',
  processing: 'processing',
  failed: 'failed',
  sent: 'sent',
  reversed: 'reversed',
  reversal_required: 'reversal_required',
  reversal_processing: 'reversal_processing',
  settled: 'settled',
};

export type TPaymentStatuses =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'failed'
  | 'sent'
  | 'reversed'
  | 'reversal_required'
  | 'reversal_processing'
  | 'settled'

export const PaymentTypes = {
  standard: 'standard',
  clearing: 'clearing',
};

export type TPaymentTypes =
  | 'standard'
  | 'clearing';

export const PaymentFeeTypes = {
  total: 'total',
  markup: 'markup',
};

export type TPaymentFeeTypes =
  | 'total'
  | 'markup';

export interface IPaymentFee {
  type: TPaymentFeeTypes;
  amount: number;
}

export interface IPayment {
  id: string;
  reversal_id: string | null;
  source_trace_id: string | null;
  destination_trace_id: string | null;
  source: string;
  destination: string;
  amount: number;
  description: string;
  status: TPaymentStatuses;
  error: IResourceError | null;
  metadata: {} | null;
  estimated_completion_date: string | null;
  source_settlement_date: string | null;
  destination_settlement_date: string | null;
  source_status: TPaymentStatuses;
  destination_status: TPaymentStatuses;
  fee: IPaymentFee | null
  type: TPaymentTypes;
  created_at: string;
  updated_at: string;
}

export interface IPaymentCreateOpts {
  amount: number;
  source: string;
  destination: string;
  description?: string;
  metadata?: {};
  fee?: IPaymentFee;
}

export interface IPaymentListOpts {
  to_date?: string | null;
  from_date?: string | null;
  page?: number | string | null;
  page_limit?: number | string | null;
  page_cursor?: string | null;
  status?: string | null;
  type?: string | null;
  source?: string | null;
  destination?: string | null;
  reversal_id?: string | null;
  source_holder_id?: string;
  destination_holder_id?: string;
  acc_id?: string;
  holder_id?: string;
}

export class PaymentSubResources {
  reversals: Reversal;

  constructor(id: string, config: Configuration) {
    this.reversals = new Reversal(config.addPath(id));
  }
}

export default class Payment extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
  }

  protected _call(id): PaymentSubResources {
    return new PaymentSubResources(id, this.config);
  }

  async get(id: string) {
    return super._getWithId<IPayment>(id);
  }

  async list(opts?: IPaymentListOpts) {
    return super._list<IPayment, IPaymentListOpts>(opts);
  }

  async create(opts: IPaymentCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IPayment, IPaymentCreateOpts>(opts, requestConfig);
  }

  async delete(id: string) {
    return super._delete<IPayment>(id);
  }
};
