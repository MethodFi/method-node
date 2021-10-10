import Resource from '../../resource';
import Configuration from '../../configuration';

export const PaymentStatuses = {
   pending: 'pending',
   sent: 'sent',
   canceled: 'canceled',
   returned: 'returned',
   error: 'error',
};

export type TPaymentStatuses =
  | 'pending'
  | 'sent'
  | 'canceled'
  | 'returned'
  | 'error';

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

export default class Payment extends Resource {
  constructor(config: Configuration) {
    super('/payments', config);
  }

  async get(id: string) {
    return super._getWithId<IPayment>(id);
  }

  async list() {
    return super._list<IPayment>();
  }

  async create(opts: IPaymentCreateOpts) {
    return super._create<IPayment, IPaymentCreateOpts>(opts);
  }

  async delete(id: string) {
    return super._delete<IPayment>(id);
  }
};
