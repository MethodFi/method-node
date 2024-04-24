import Resource, { IRequestConfig, IResourceError, IResourceListOpts } from '../../resource';
import Configuration from '../../configuration';
import Reversal from './Reversals';

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

export type TPaymentStatuses = keyof typeof PaymentStatuses;

export const PaymentFundStatuses = {
  hold: 'hold',
  pending: 'pending',
  requested: 'requested',
  clearing: 'clearing',
  failed: 'failed',
  sent: 'sent',
  unknown: 'unknown',
};

export type TPaymentFundStatuses = keyof typeof PaymentFundStatuses;

export const PaymentTypes = {
  standard: 'standard',
  clearing: 'clearing',
};

export type TPaymentTypes = keyof typeof PaymentTypes;

export const PaymentFeeTypes = {
  total: 'total',
  markup: 'markup',
};

export type TPaymentFeeTypes = keyof typeof PaymentFeeTypes;

export interface IPaymentFee {
  type: TPaymentFeeTypes;
  amount: number;
};

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
  fund_status?: TPaymentFundStatuses;
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
};

export interface IPaymentCreateOpts {
  amount: number;
  source: string;
  destination: string;
  description: string;
  metadata?: {};
  fee?: IPaymentFee;
};

export interface IPaymentListOpts extends IResourceListOpts {
  status?: string | null;
  type?: string | null;
  source?: string | null;
  destination?: string | null;
  reversal_id?: string | null;
  source_holder_id?: string;
  destination_holder_id?: string;
  acc_id?: string;
  holder_id?: string;
};

export class PaymentSubResources {
  reversals: Reversal;

  constructor(id: string, config: Configuration) {
    this.reversals = new Reversal(config.addPath(id));
  }
};

export interface Payment {
  (id: string): PaymentSubResources;
};

export class Payment extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
  }

  protected _call(id): PaymentSubResources {
    return new PaymentSubResources(id, this.config);
  }

  /**
   * Retrieves payment by id
   * 
   * @param pmt_id id of the payment
   * @returns IPayment
   */

  async retrieve(pmt_id: string) {
    return super._getWithId<IPayment>(pmt_id);
  }

  /**
   * Lists all payments
   * 
   * @param opts IPaymentListOpts: https://docs.methodfi.com/api/core/payments/list
   * @returns IPayment[]
   */

  async list(opts?: IPaymentListOpts) {
    return super._list<IPayment, IPaymentListOpts>(opts);
  }

  /**
   * Creates a payment
   * 
   * @param opts IPaymentCreateOpts
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns IPayment
   */

  async create(opts: IPaymentCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IPayment, IPaymentCreateOpts>(opts, requestConfig);
  }

  /**
   * Cancels a payment
   * 
   * @param pmt_id id of the payment
   * @returns IPayment
   */

  async delete(pmt_id: string) {
    return super._delete<IPayment>(pmt_id);
  }
};

export default Payment;
