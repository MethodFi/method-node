import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import Verification from '../Verification';
import AccountSync, { IAccountSync } from '../AccountSync';

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
  data_retrieve: 'data:retrieve',
  data_sync: 'data:sync',
};

export type TAccountCapabilities =
  | 'payments:receive'
  | 'payments:send'
  | 'data:retrieve'
  | 'data:sync';

export const AccountLiabilityPaymentStatuses = {
  active: 'active',
  activating: 'activating',
  unavailable: 'unavailable',
};

export type TAccountLiabilityPaymentStatuses =
  | 'active'
  | 'activating'
  | 'unavailable';

export const AccountLiabilityDataStatuses = {
  active: 'active',
  syncing: 'syncing',
  unavailable: 'unavailable',
  failed: 'failed',
  pending: 'pending',
};

export type TAccountLiabilityDataStatuses =
  | 'active'
  | 'syncing'
  | 'unavailable'
  | 'failed'
  | 'pending';

export const AccountLiabilitySyncTypes = {
  manual: 'manual',
  auto: 'auto',
};

export type TAccountLiabilitySyncTypes =
  | 'manual'
  | 'auto';

export const TradelineAccountOwnership = {
  primary: 'primary',
  authorized: 'authorized',
  joint: 'joint',
  unknown: 'unknown',
};

export type TTradelineAccountOwnership =
  | 'primary'
  | 'authorized'
  | 'joint'
  | 'unknown';

export const AccountLiabilityDataSources = {
  credit_report: 'credit_report',
  financial_institution: 'financial_institution',
  unavailable: 'unavailable',
};

export type TAccountLiabilityDataSources =
  | 'credit_report'
  | 'financial_institution'
  | 'unavailable';

export const AccountLiabilityTypes = {
  student_loan: 'student_loan',
  student_loans: 'student_loans',
  credit_card: 'credit_card',
  mortgage: 'mortgage',
  auto_loan: 'auto_loan',
  collection: 'collection',
  personal_loan: 'personal_loan',
  business_loan: 'business_loan',
  insurance: 'insurance',
  credit_builder: 'credit_builder',
  subscription: 'subscription',
  utility: 'utility',
  medical: 'medical',
  loan: 'loan',
};

export type TAccountLiabilityTypes =
  | 'student_loan'
  | 'student_loans'
  | 'credit_card'
  | 'mortgage'
  | 'auto_loan'
  | 'collection'
  | 'personal_loan'
  | 'business_loan'
  | 'insurance'
  | 'credit_builder'
  | 'subscription'
  | 'utility'
  | 'medical'
  | 'loan';

export const PastDueStatuses = {
  unknown: 'unknown',
  overdue: 'overdue',
  on_time: 'on_time',
};

export type TPastDueStatuses = 'unknown' | 'overdue' | 'on_time';

export const AutoPayStatuses = {
  unknown: 'unknown',
  active: 'active',
  inactive: 'inactive',
};

export type TAutoPayStatuses = 'unknown' | 'active' | 'inactive';

export const DelinquencyPeriods = {
  less_than_30: 'less_than_30',
  '30': '30',
  '60': '60',
  '90': '90',
  '120': '120',
  over_120: 'over_120',
};

export type TDelinquencyPeriod = 
  | 'less_than_30'
  | '30'
  | '60'
  | '90'
  | '120'
  | 'over_120';

export const DelinquencyActions = {
  chapter_13: 'chapter_13',
  chapter_7: 'chapter_7',
  wage_garnishment: 'wage_garnishment',
  charge_off: 'charge_off',
  payment_agreement: 'payment_agreement',
  repossession: 'repossession',
  foreclosure: 'foreclosure',
  bankruptcy: 'bankruptcy',
};

export type TDelinquencyActions = 
  | 'chapter_13'
  | 'chapter_7'
  | 'wage_garnishment'
  | 'charge_off'
  | 'payment_agreement'
  | 'repossession'
  | 'foreclosure'
  | 'bankruptcy';

export const DelinquencyStatuses = {
  good_standing: 'good_standing',
  past_due: 'past_due',
  major_delinquency: 'major_delinquency',
  unavailable: 'unavailable',
};

export type TDelinquencyStatus = 
  | 'good_standing'
  | 'past_due'
  | 'major_delinquency'
  | 'unavailable';

export const AccountPayoffStatuses = {
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  failed: 'failed'
};

export type TAccountPayoffStatuses = 
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'failed'

export const SensitiveFields = {
  number: 'number',
  encrypted_number: 'encrypted_number', 
  bin_4: 'bin_4', 
  bin_6: 'bin_6', 
  payment_address: 'payment_address', 
  encrypted_tabapay_card: 'encrypted_tabapay_card', 
  billing_zip_code: 'billing_zip_code', 
  expiration_month: 'expiration_month', 
  expiration_year: 'expiration_year'
}

export type TSensitiveFields =
  |'number'
  |'encrypted_number'
  |'bin_4'
  |'bin_6'
  |'payment_address'
  |'encrypted_tabapay_card'
  |'billing_zip_code'
  |'expiration_month'
  |'expiration_year'

export interface TDelinquencyHistoryItem {
  start_date: string;
  end_date: string;
  status: TDelinquencyStatus;
  period: TDelinquencyPeriod | null;
};

export interface TTrendedDataItem {
  month: number | null;
  year: number | null;
  balance: number | null;
  available_credit: number | null;
  scheduled_payment: number | null;
  actual_payment: number | null;
  high_credit: number | null;
  credit_limit: number | null;
  amount_past_due: number | null;
  last_payment_date: string | null;
  account_status: string;
  payment_status: string;
};

export type TLiabilityMortgageUpdateOpts = {
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
}

export type TLiabilityCreditCardUpdateOpts = {
  number: string;
} | {
  expiration_month: number;
  expiration_year: number;
};

export interface IAccountLiabilityLoan {
  name: string;
  balance: number | null;
  opened_at: string | null;
  original_loan_amount: number | null;
  sub_type: string | null;
  term_length?: number | null;
  closed_at: string | null;
  delinquent_status: TDelinquencyStatus | null;
  delinquent_amount: number | null;
  delinquent_period: TDelinquencyPeriod | null;
  delinquent_action: TDelinquencyActions | null;
  delinquent_start_date: string | null;
  delinquent_major_start_date: string | null;
  delinquent_status_updated_at: string | null;
  delinquent_history: TDelinquencyHistoryItem[];
  last_payment_amount: number | null;
  last_payment_date: string | null;
  next_payment_minimum_amount: number | null;
  next_payment_due_date: string | null;
  interest_rate_type?: 'fixed' | 'variable';
  interest_rate_percentage?: number | null;
  interest_rate_source?: 'financial_institution' | 'public_data' | 'method' | null;
}

export interface IAccountLiabilityCreditCard extends IAccountLiabilityLoan {
  last_statement_balance: number | null;
  remaining_statement_balance: number | null;
  available_credit: number | null;
  auto_pay_status: TAutoPayStatuses | null;
  auto_pay_amount: number | null;
  auto_pay_date: string | null;
  past_due_status: TPastDueStatuses | null;
  past_due_balance: number | null;
  past_due_date: string | null;
  credit_limit: number | null;
  pending_purchase_authorization_amount: number | null;
  pending_credit_authorization_amount: number | null;
  interest_saving_balance: number | null;
  next_statement_date: string | null;
}

export interface IAccountLiabilityAutoLoan extends IAccountLiabilityLoan {
  sub_type: 'lease' | 'loan' | null;
  payoff_amount: number | null;
  payoff_amount_term: number | null;
  past_due_status: TPastDueStatuses | null;
  past_due_balance: number | null;
  past_due_date: string | null;
  late_fees_amount: number | null;
  expected_payoff_date: string | null;
  principal_balance: number | null;
  per_diem_amount: number | null;
  mileage_allocation: number | null;
}

export interface IAccountLiabilityStudentLoan extends IAccountLiabilityLoan {
  sub_type: 'federal' | 'private' | null;
  sequence: number | null;
  disbursed_at: string | null;
  expected_payoff_date: string | null;
  payoff_amount: number | null;
  payoff_amount_term: number | null;
  principal_balance: number | null;
}

export interface IAccountLiabilityStudentLoansDisbursement extends IAccountLiabilityLoan {
  sequence: number;
  disbursed_at: string | null;
  expected_payoff_date: string | null;
  trended: TTrendedDataItem[];
}

export interface IAccountLiabilityStudentLoans extends IAccountLiabilityLoan {
  sub_type: 'federal' | 'private' | null;
  expected_payoff_date: string | null;
  disbursements: IAccountLiabilityStudentLoansDisbursement[];
}

export interface IAccountLiabilityMortgage extends IAccountLiabilityLoan {
  principal_balance: number | null;
  expected_payoff_date: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  property_value: number | null;
  past_due_status: TPastDueStatuses | null;
  past_due_balance: number | null;
  past_due_date: string | null;
  payoff_amount: number | null;
  payoff_amount_term: number | null;
  year_to_date_interest_paid: number | null;
  year_to_date_principal_paid: number | null;
  year_to_date_taxes_paid: number | null;
  year_start_principal_balance: number | null;
  escrow_balance: number | null;
}

export interface IAccountLiabilityPersonalLoan extends IAccountLiabilityLoan {
  expected_payoff_date: string | null;
  available_credit: number | null;
  principal_balance: number | null;
  year_to_date_interest_paid: number | null;
}

export interface IAccountLiabilityCreditBuilder extends IAccountLiabilityLoan { }

export interface IAccountLiabilityCollection extends IAccountLiabilityLoan { }

export interface IAccountLiabilityBusinessLoan {
  name: string;
  balance: number | null;
  opened_at: string | null;
}
export interface IAccountLiabilityInsurance {
  name: string;
  balance: number | null;
  opened_at: string | null;
}
export interface IAccountLiabilitySubscription {
  name: string;
  balance: number | null;
  opened_at: string | null;
}

export interface IAccountLiabilityUtility {
  name: string;
  balance: number | null;
  opened_at: string | null;
}
export interface IAccountLiabilityMedical {
  name: string;
  balance: number | null;
  opened_at: string | null;
}

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAccountSubTypes;
}

export interface IAccountLiability {
  mch_id: string;
  mask: string;
  payment_status: TAccountLiabilityPaymentStatuses;
  data_status: TAccountLiabilityDataStatuses;
  data_last_successful_sync: string | null;
  data_status_error: IResourceError | null;
  data_source: TAccountLiabilityDataSources;
  data_updated_at: string | null;
  data_sync_type: TAccountLiabilitySyncTypes;
  ownership: TTradelineAccountOwnership;
  hash: string;
  fingerprint: string;
  type: TAccountLiabilityTypes;
  loan: IAccountLiabilityLoan | null;
  student_loan: IAccountLiabilityStudentLoan | null;
  student_loans: IAccountLiabilityStudentLoans | null;
  credit_card: IAccountLiabilityCreditCard | null;
  mortgage: IAccountLiabilityMortgage | null;
  auto_loan: IAccountLiabilityAutoLoan | null;
  personal_loan: IAccountLiabilityPersonalLoan | null;
  business_loan: IAccountLiabilityBusinessLoan | null;
  collection: IAccountLiabilityCollection | null;
  insurance: IAccountLiabilityInsurance | null;
  credit_builder: IAccountLiabilityCreditBuilder | null;
  subscription: IAccountLiabilitySubscription | null;
  utility: IAccountLiabilityUtility | null;
  medical: IAccountLiabilityMedical | null;
}

export type IAccountClearing = {
  routing: string;
  number: string;
};

export interface IAccount {
  id: string;
  holder_id: string;
  status: TAccountStatuses;
  type: TAccountTypes;
  ach: IAccountACH | null;
  liability: IAccountLiability | null;
  clearing: IAccountClearing | null;
  capabilities: TAccountCapabilities[];
  available_capabilities: TAccountCapabilities[];
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
  ach: IAccountACH;
}

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string;
    account_number?: string;
    number?: string;
  }
}

export interface ILiabilityUpdateOpts {
  mortgage: TLiabilityMortgageUpdateOpts | null;
  credit_card: TLiabilityCreditCardUpdateOpts | null;
}

export interface IClearingCreateOpts extends IAccountCreateOpts {
  clearing: {
    type: TAccountClearingSubTypes;
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

export interface IAccountSensitive {
  number: string | null;
  encrypted_number: string | null;
  bin_4: string | null;
  bin_6: string | null;
  payment_address: any | null;
}

export interface IAccountCreateBulkSensitiveResponse {
  success: string[];
  failed: string[];
  results: IAccountSensitive[];
}

export interface IAccountCreateBulkSensitiveOpts {
  acc_ids: string[];
  fields: TSensitiveFields[];
}

export interface IAccountWithdrawConsentOpts {
  type: 'withdraw';
  reason: 'holder_withdrew_consent' | null;
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
  'liability.mch_id'?: string | null;
  'liability.type'?: string | null;
}

export interface IAccountDetails {
  id: string;
  type: TAccountTypes;
  aggregator: string | null;
  name: string;
  institution_name: string;
  institution_logo: string;
  mask: string;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
}

export interface ICreditReportTradelinePaymentHistoryItem {
  code: number;
  date: string;
};

export interface IAccountPaymentHistory {
  payment_history: ICreditReportTradelinePaymentHistoryItem[];
}

export interface IAccountPayoff {
  id: string,
  status: TAccountPayoffStatuses,
  amount: number | null,
  term: number | null,
  per_diem_amount: number | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
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

  async update(id: string, opts: ILiabilityUpdateOpts) {
    return super._updateWithId<IAccount, ILiabilityUpdateOpts>(id, opts);
  }

  async list(opts?: IAccountListOpts) {
    return super._list<IAccount, IAccountListOpts>(opts);
  }

  async create(data: IACHCreateOpts | ILiabilityCreateOpts | IClearingCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts | IClearingCreateOpts>(data, requestConfig);
  }

  async getPaymentHistory(id: string) {
    return super._getWithSubPath<IAccountPaymentHistory>(`/${id}/payment_history`);
  }

  async getDetails(id: string) {
    return super._getWithSubPath<IAccountDetails>(`/${id}/details`);
  }

  async bulkSync(acc_ids: string[]) {
    return super._createWithSubPath<IAccountCreateBulkSyncResponse, IAccountCreateBulkSyncOpts>(
      '/bulk_sync',
      { acc_ids },
    );
  }

  async sync(id: string) {
    return super._createWithSubPath<IAccountSync, {}>(`/${id}/syncs`, {});
  }

  async bulkSensitive(acc_ids: string[], fields: TSensitiveFields[]) {
    return super._createWithSubPath<IAccountCreateBulkSensitiveResponse, IAccountCreateBulkSensitiveOpts>(
      '/bulk_sensitive',
      { acc_ids, fields },
    );
  }

  async getPayoff(acc_id: string, pyf_id: string) {
    return super._getWithSubPath<IAccountPayoff>(`/${acc_id}/payoffs/${pyf_id}`);
  }

  async createPayoff(id: string) {
    return super._createWithSubPath<IAccountPayoff, {}>(`/${id}/payoffs`, {});
  }

  async sensitive(id: string) {
    return super._getWithSubPath<IAccountSensitive>(`/${id}/sensitive`);
  }

  async enrollAutoSyncs(id: string) {
    return super._createWithSubPath<IAccount, {}>(`/${id}/sync_enrollment`, {});
  }

  async unenrollAutoSyncs(id: string) {
    return super._deleteWithSubPath<IAccount, {}>(`/${id}/sync_enrollment`, {});
  }

  async withdrawConsent(id: string, data: IAccountWithdrawConsentOpts = { type: 'withdraw', reason: 'holder_withdrew_consent' }) {
    return super._createWithSubPath<IAccount, IAccountWithdrawConsentOpts>(
      `/${id}/consent`,
      data,
    );
  }
}
