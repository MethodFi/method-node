// @flow
import {
  PaymentStatuses,
  PaymentFundStatuses,
} from './enums';


export type TPaymentStatuses = $Keys<typeof PaymentStatuses>;

export type TPaymentFundStatuses = $Keys<typeof PaymentFundStatuses>;

export type TPaymentMetadata = { [string]: any };

export type TPaymentResponse = {
  id: string,
  source: string,
  destination: string,
  amount: number,
  description: string,
  status: TPaymentStatuses,
  fund_status?: TPaymentFundStatuses,
  error: ?string,
  metadata: ?TPaymentMetadata,
  created_at: string,
  updated_at: string,
};

export type TPaymentCreateOptions = {
  amount: number,
  source: string,
  destination: string,
  description: string,
  metadata?: TPaymentMetadata,
};

