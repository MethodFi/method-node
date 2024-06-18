import type { IResourceError, IResourceListOpts } from '../../resource';

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
} as const;

export type TPaymentStatuses = keyof typeof PaymentStatuses;

export const PaymentFundStatuses = {
  hold: 'hold',
  pending: 'pending',
  requested: 'requested',
  clearing: 'clearing',
  failed: 'failed',
  sent: 'sent',
  unknown: 'unknown',
} as const;

export type TPaymentFundStatuses = keyof typeof PaymentFundStatuses;

export const PaymentTypes = {
  standard: 'standard',
  clearing: 'clearing',
} as const;

export type TPaymentTypes = keyof typeof PaymentTypes;

export const PaymentFeeTypes = {
  total: 'total',
  markup: 'markup',
} as const;

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

export const ReversalStatuses = {
  pending_approval: 'pending_approval',
  pending: 'pending',
  processing: 'processing',
  sent: 'sent',
  failed: 'failed',
} as const;

export type TReversalStatuses = keyof typeof ReversalStatuses;

export const ReversalDirections = {
  debit: 'debit',
  credit: 'credit',
} as const;

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
