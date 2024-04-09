import { IResourceError } from "../../resource";
import { 
  IAccountVerificaitonSessionPlaid,
  IAccountVerificationSessionPreAuth,
  IAccountVerificationSessionInstant,
  IAccountVerificationSessionMX,
  IAccountVerificationSessionTeller,
  IAccountVerificationSessionStandard,
  IAccountVerificationSessionMicroDeposits,
  IAccountVerificationSessionThreeDS,
  IAccountVerificationSessionIssuer,
  TAccountVerificationSessionStatuses,
  TAccountVerificaionSessionTypes
} from "./VerificationSessions";

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

export const AccountLiabilityPersonalLoanSubTypes = {
  line_of_credit: 'line_of_credit',
  heloc: 'heloc',
  secured: 'secured',
  unsecured: 'unsecured',
  note: 'note',
};

export type TAccountLiabilityPersonalLoanSubTypes =
  | 'line_of_credit'
  | 'heloc'
  | 'secured'
  | 'unsecured'
  | 'note';

export const AccountLiabilityCreditCardSubTypes = {
  flexible_spending: 'flexible_spending',
  charge: 'charge',
  secured: 'secured',
  unsecured: 'unsecured',
  purchase: 'purchase',
  business: 'business',
};

export type TAccountLiabilityCreditCardSubTypes =
  | 'flexible_spending'
  | 'charge'
  | 'secured'
  | 'unsecured'
  | 'purchase'
  | 'business';

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

export const SensitiveFields = {
  number: 'number',
  encrypted_number: 'encrypted_number', 
  bin_4: 'bin_4', 
  bin_6: 'bin_6', 
  payment_address: 'payment_address', 
  encrypted_tabapay_card: 'encrypted_tabapay_card', 
  billing_zip_code: 'billing_zip_code', 
  expiration_month: 'expiration_month', 
  expiration_year: 'expiration_year',
}

export type TSensitiveFields =
  | 'number'
  | 'encrypted_number'
  | 'bin_4'
  | 'bin_6'
  | 'payment_address'
  | 'encrypted_tabapay_card'
  | 'billing_zip_code'
  | 'expiration_month'
  | 'expiration_year';

  export const AccountExpandableFields = {
    latest_verification_session: 'latest_verification_session',
  };
  
  export type TAccountExpandableFields = 
    | 'latest_verification_session';

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
};

export interface IAccountLiabilityCreditCard extends IAccountLiabilityLoan {
  sub_type:  TAccountLiabilityCreditCardSubTypes | null;
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
};

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
};

export interface IAccountLiabilityStudentLoan extends IAccountLiabilityLoan {
  sub_type: 'federal' | 'private' | null;
  sequence: number | null;
  disbursed_at: string | null;
  expected_payoff_date: string | null;
  payoff_amount: number | null;
  payoff_amount_term: number | null;
  principal_balance: number | null;
};

export interface IAccountLiabilityStudentLoansDisbursement extends IAccountLiabilityLoan {
  sequence: number;
  disbursed_at: string | null;
  expected_payoff_date: string | null;
  trended: TTrendedDataItem[];
};

export interface IAccountLiabilityStudentLoans extends IAccountLiabilityLoan {
  sub_type: 'federal' | 'private' | null;
  expected_payoff_date: string | null;
  disbursements: IAccountLiabilityStudentLoansDisbursement[];
};

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
};

export interface IAccountLiabilityPersonalLoan extends IAccountLiabilityLoan {
  sub_type: TAccountLiabilityPersonalLoanSubTypes | null,
  expected_payoff_date: string | null;
  available_credit: number | null;
  principal_balance: number | null;
  year_to_date_interest_paid: number | null;
};

export interface IAccountLiabilityCreditBuilder extends IAccountLiabilityLoan { };

export interface IAccountLiabilityCollection extends IAccountLiabilityLoan { };

export interface IAccountLiabilityBusinessLoan {
  name: string;
  balance: number | null;
  opened_at: string | null;
};

export interface IAccountLiabilityInsurance {
  name: string;
  balance: number | null;
  opened_at: string | null;
};
export interface IAccountLiabilitySubscription {
  name: string;
  balance: number | null;
  opened_at: string | null;
};

export interface IAccountLiabilityUtility {
  name: string;
  balance: number | null;
  opened_at: string | null;
};
export interface IAccountLiabilityMedical {
  name: string;
  balance: number | null;
  opened_at: string | null;
};

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAccountSubTypes;
};

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
};

export type IAccountClearing = {
  routing: string;
  number: string;
};

export interface IAccountLatestVerificationSession {
  id: string;
  status: string;
  status_error: string | null;
  type: string;
  three_ds?: IAccountVerificationSessionThreeDS;
  issuer?: IAccountVerificationSessionIssuer;
  created_at: string;
  updated_at: string;
}

export interface IAccountVerificationSessionString {
  latest_verification_session: string;
}

export interface IAccountVerificationSessionExpanded {
  latest_verification_session: {
    id: string;
    status: TAccountVerificationSessionStatuses;
    status_error: IResourceError | null;
    type: TAccountVerificaionSessionTypes;
    three_ds?: IAccountVerificationSessionThreeDS;
    pre_auth?: IAccountVerificationSessionPreAuth;
    issuer?: IAccountVerificationSessionIssuer;
    plaid?: IAccountVerificaitonSessionPlaid;
    mx?: IAccountVerificationSessionMX;
    teller?: IAccountVerificationSessionTeller;
    instant?: IAccountVerificationSessionInstant;
    standard?: IAccountVerificationSessionStandard;
    micro_deposits?: IAccountVerificationSessionMicroDeposits;
    created_at: string;
    updated_at: string;
  };
}

export interface IAccountBase {
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
};

export type IAccount = IAccountBase & IAccountVerificationSessionString;
export type IAccountExpanded = IAccountBase & IAccountVerificationSessionExpanded;