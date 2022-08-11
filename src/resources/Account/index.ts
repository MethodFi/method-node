import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import Verification from '../Verification';
import AccountSync, { IAccountSync } from "../AccountSync";

export const AccountTypes = {
   ach: 'ach',
   liability: 'liability',
   clearing: 'clearing',
}

export type TAccountTypes =
  | 'ach'
  | 'liability'
  | 'clearing';

export const AccountSubTypes = {
   savings: 'savings',
   checking: 'checking',
}

export type TAccountSubTypes =
  | 'savings'
  | 'checking';

export const AccountClearingSubTypes = {
  single_use: 'single_use',
}

export type TAccountClearingSubTypes =
    | 'single_use';

export const AccountStatuses = {
  disabled: 'disabled',
  active: 'active',
  processing: 'processing',
  closed: 'closed'
};

export type TAccountStatuses =
  | 'disabled'
  | 'active'
  | 'processing'
  | 'closed';

export const AccountCapabilities = {
  payments_receive: 'payments:receive',
  payments_send: 'payments:send',
};

export type TAccountCapabilities =
  | 'payments:receive'
  | 'payments:send';

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAccountSubTypes;
}

export type IAccountLiability = {
  mch_id: string;
  mask: string;
};

export type IAccountClearing = {
  routing: string;
  number: string;
};

export interface IAccount {
  id: string;
  holder_id: string;
  status: TAccountStatuses;
  capabilities: TAccountCapabilities[];
  type: TAccountTypes;
  ach: IAccountACH | null;
  liability: IAccountLiability | null;
  clearing: IAccountClearing | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
}

export interface IAccountCreateOpts {
  holder_id: string;
  metadata?: {};
}

export interface IACHCreateOpts extends IAccountCreateOpts {
  ach: IAccountACH
}

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string,
    account_number: string,
  }
}

export interface IClearingCreateOpts extends IAccountCreateOpts {
  clearing: {
    type: TAccountClearingSubTypes,
  }
}

export interface IAccountCreateBulkSyncOpts {
  acc_ids: string[];
}

export interface IAccountCreateBulkSyncResponse {
  success: string[];
  failed: string[];
  results: IAccountSync[];
}

export interface IAccountListOpts {
  to_date?: string | null;
  from_date?: string | null;
  page?: number | string | null;
  page_limit?: number | string | null;
  page_cursor?: string | null;
  status?: string | null;
  type?: string | null;
  holder_id?: string | null;
}

export const AccountDetailTypes = {
  bnpl_loan: 'bnpl_loan',
  depository: 'depository',
  student_loan: 'student_loan',
  credit_card: 'credit_card',
};

export type TAccountDetailTypes =
  | 'bnpl_loan'
  | 'depository'
  | 'student_loan'
  | 'credit_card';

export interface IAccountDetailBNPLLoanUpcomingPaymentDue {
  amount: number;
  date: string;
}

export interface IAccountDetailBNPLLoan {
  name: string | null;
  reference_id: string;
  balance: number;
  purchase_date: string;
  next_payment_due_date: string | null;
  total_payments_count: number;
  payments_made_count: number;
  remaining_payments_count: number;
  autopay_enabled: boolean;
  payoff_progress: number;
  interest_rate: number;
  description: string | null;
  total_cost: number;
  total_paid: number;
  status: 'paid_off' | 'refunded' | 'in_progress';
  upcoming_payments_due: IAccountDetailBNPLLoanUpcomingPaymentDue[];
}

export interface IAccountDetailDepository {
  name: string | null;
  reference_number: string;
  balance: number;
}

export interface IAccountDetailCreditCard {
  name: string | null;
  reference_number: string;
  balance: number;
  last_payment_amount: number;
  last_payment_date: string | null;
  next_payment_due_date: string | null;
  next_payment_minimum_amount: number;
}

// TODO[mdelcarmen]
export interface IAccountDetailStudentLoan {}

export interface IAccountDetail {
  type: TAccountDetailTypes;
  bnpl_loan: IAccountDetailBNPLLoan | null;
  depository: IAccountDetailDepository | null;
  credit_card: IAccountDetailCreditCard | null;
  student_loan: IAccountDetailStudentLoan | null;
}

export interface IAccountTransaction {
  id: string;
  reference_id: string;
  date: string;
  amount: number;
  status: 'pending' | 'success';
  description: string | null;
}

export class AccountSubResources {
  verification: Verification;
  syncs: AccountSync;

  constructor(id: string, config: Configuration) {
    this.verification = new Verification(config.addPath(id));
    this.syncs = new AccountSync(config.addPath(id));
  }
}

export default class Account extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('accounts'));
  }

  protected _call(id): AccountSubResources {
    return new AccountSubResources(id, this.config);
  }

  async get(id: string) {
    return super._getWithId<IAccount>(id);
  }

  async list(opts?: IAccountListOpts) {
    return super._list<IAccount, IAccountListOpts>(opts);
  }

  async create(data: IACHCreateOpts | ILiabilityCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts | IClearingCreateOpts>(data, requestConfig);
  }

  async getDetail(id: string) {
    return super._getWithSubPath<IAccountDetail>(`/${id}/detail`);
  }

  async getTransactions(id: string) {
    return super._getWithSubPath<IAccountTransaction[]>(`/${id}/transactions`);
  }

  async bulkSync(acc_ids: string[]) {
    return super._createWithSubPath<IAccountCreateBulkSyncResponse, IAccountCreateBulkSyncOpts>(
      '/bulk_sync',
      { acc_ids },
    );
  }
}
