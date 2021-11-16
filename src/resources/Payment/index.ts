import Resource, { IRequestConfig } from '../../resource';
import Configuration from '../../configuration';

export const PaymentStatuses = {
  pending: 'pending',
  canceled: 'canceled',
  processing: 'processing',
  failed: 'failed',
  sent: 'sent',
  reversed: 'reversed',
};

export type TPaymentStatuses =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'failed'
  | 'sent'
  | 'reversed';

export const PaymentFundStatuses = {
  hold: 'hold',
  pending: 'pending',
  requested: 'requested',
  received: 'received',
  sent: 'sent',
  unknown: 'unknown',
}

export type TPaymentFundStatuses =
  | 'hold'
  | 'pending'
  | 'requested'
  | 'received'
  | 'sent'
  | 'unknown';

export interface IPayment {
  id: string;
  source: string;
  destination: string;
  amount: number;
  description: string;
  status: TPaymentStatuses;
  fund_status?: TPaymentFundStatuses;
  error: string | null;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
}

export interface IPaymentCreateOpts {
  amount: number;
  source: string;
  destination: string;
  description: string;
  metadata?: {};
}

export default class Payment extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
  }

  async get(id: string) {
    return super._getWithId<IPayment>(id);
  }

  async list() {
    return super._list<IPayment>();
  }

  async create(opts: IPaymentCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IPayment, IPaymentCreateOpts>(opts, requestConfig);
  }

  async delete(id: string) {
    return super._delete<IPayment>(id);
  }
};
