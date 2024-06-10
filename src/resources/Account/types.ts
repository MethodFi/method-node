import type {
  IResourceError,
  TResourceStatus,
  IResourceListOpts,
} from '../../resource';
import type {
  IPlaidBalance,
  IPlaidTransaction,
  IMXAccount,
  IMXTransaction,
  ITellerBalance,
  ITellerTransaction,
} from './externalTypes';

export const AccountTypes = {
  ach: 'ach',
  liability: 'liability',
} as const;

export type TAccountTypes = keyof typeof AccountTypes;

export const AccountStatuses = {
  disabled: 'disabled',
  active: 'active',
  closed: 'closed',
} as const;

export type TAccountStatuses = keyof typeof AccountStatuses;

export const AccountProducts = {
  payment: 'payment',
  balance: 'balance',
  sensitive: 'sensitive',
  card_brand: 'card_brand',
  payoff: 'payoff',
  update: 'update',
} as const;

export type TAccountProducts = keyof typeof AccountProducts;

export const AccountSubscriptionTypes = {
  transactions: 'transactions',
  update: 'update',
  update_snapshot: 'update.snapshot',
} as const;

export type TAccountSubscriptionTypes = typeof AccountSubscriptionTypes[keyof typeof AccountSubscriptionTypes];

export const AccountOwnership = {
  primary: 'primary',
  authorized: 'authorized',
  joint: 'joint',
  unknown: 'unknown',
} as const;

export type TAccountOwnership = keyof typeof AccountOwnership;

export const AccountUpdateSources = {
  direct: 'direct',
  snapshot: 'snapshot',
} as const;

export type TAccountUpdateSources = keyof typeof AccountUpdateSources;

export const AccountLiabilityTypes = {
  auto_loan: 'auto_loan',
  credit_card: 'credit_card',
  collection: 'collection',
  mortgage: 'mortgage',
  personal_loan: 'personal_loan',
  student_loans: 'student_loans',
} as const;

export type TAccountLiabilityTypes = keyof typeof AccountLiabilityTypes;

export const AchAccountSubTypes = {
  savings: 'savings',
  checking: 'checking',
} as const;

export type TAchAccountSubTypes = keyof typeof AchAccountSubTypes;

export const AccountExpandableFields = {
  ...AccountProducts,
  latest_verification_session: 'latest_verification_session',
} as const;

export type TAccountExpandableFields = keyof typeof AccountExpandableFields;

export const AccountLiabilityInterestRateTypes = {
  fixed: 'fixed',
  variable: 'variable',
} as const;

export type TAccountLiabilityInterestRateTypes = keyof typeof AccountLiabilityInterestRateTypes;

export const AccountLiabilityInterestRateSources = {
  financial_institution: 'financial_institution',
  public_data: 'public_data',
  method: 'method',
} as const;

export type TAccountLiabilityInterestRateSources = keyof typeof AccountLiabilityInterestRateSources;

export const AccountAutoLoanSubTypes = {
  lease: 'lease',
  loan: 'loan',
} as const;

export type TAccountAutoLoanSubTypes = keyof typeof AccountAutoLoanSubTypes;

export const AccountLiabilityCreditCardSubTypes = {
  flexible_spending: 'flexible_spending',
  charge: 'charge',
  secured: 'secured',
  unsecured: 'unsecured',
  purchase: 'purchase',
  business: 'business',
} as const;

export type TAccountLiabilityCreditCardSubTypes = keyof typeof AccountLiabilityCreditCardSubTypes;

export const AccountLiabilityCreditCardUsageTypes = {
  transactor: 'transactor',
  revolver: 'revolver',
  dormant: 'dormant',
  unknown: 'unknown',
} as const;

export type TAccountLiabilityCreditCardUsageTypes = keyof typeof AccountLiabilityCreditCardUsageTypes;

export const AccountLiabilityMortgageSubTypes = {
  loan: 'loan',
} as const;

export type TAccountLiabilityMortgageSubTypes = keyof typeof AccountLiabilityMortgageSubTypes;

export const AccountLiabilityPersonalLoanSubTypes = {
  secured: 'secured',
  unsecured: 'unsecured',
  heloc: 'heloc',
  line_of_credit: 'line_of_credit',
  note: 'note',
} as const;

export type TAccountLiabilityPersonalLoanSubTypes = keyof typeof AccountLiabilityPersonalLoanSubTypes;

export const AccountLiabilityStudentLoansSubTypes = {
  federal: 'federal',
  private: 'private',
} as const;

export type TAccountLiabilityStudentLoansSubTypes = keyof typeof AccountLiabilityStudentLoansSubTypes;

export interface IAccountLiabilityBase {
  balance: number | null;
  closed_at: string | null;
  last_payment_amount: number | null;
  last_payment_date: string | null;
  next_payment_due_date: string | null;
  next_payment_minimum_amount: number | null;
  opened_at?: string | null;
};

export interface IAccountLiabilityLoanBase extends IAccountLiabilityBase {
  expected_payoff_date?: string | null;
  interest_rate_percentage: number | null;
  interest_rate_source: TAccountLiabilityInterestRateSources | null;
  interest_rate_type: TAccountLiabilityInterestRateTypes | null;
  original_loan_amount: number | null;
  term_length: number | null;
};

export interface IAccountLiabilityAutoLoan extends IAccountLiabilityLoanBase {
  sub_type: TAccountAutoLoanSubTypes | null;
};

export interface IAccountLiabilityCreditCard extends IAccountLiabilityBase {
  available_credit: number | null;
  credit_limit: number | null;
  interest_rate_percentage_max: number | null;
  interest_rate_percentage_min: number | null;
  interest_rate_type: TAccountLiabilityInterestRateTypes | null;
  sub_type: TAccountLiabilityCreditCardSubTypes | null;
  usage_pattern: TAccountLiabilityCreditCardUsageTypes | null;
};

export interface IAccountLiabilityCollection extends IAccountLiabilityBase {};

export interface IAccountLiabilityMortgage extends IAccountLiabilityLoanBase {
  sub_type: TAccountLiabilityMortgageSubTypes | null;
};

export interface IAccountLiabilityPersonalLoan extends IAccountLiabilityLoanBase {
  available_credit: number | null;
  sub_type: TAccountLiabilityPersonalLoanSubTypes | null;
};

export interface IAccountLiabilityStudentLoansDisbursement extends IAccountLiabilityLoanBase {
  sequence: number;
  disbursed_at: string | null;
};

export interface IAccountLiabilityStudentLoans extends IAccountLiabilityBase {
  disbursements: IAccountLiabilityStudentLoansDisbursement[];
  original_loan_amount: number | null;
  sub_type: TAccountLiabilityStudentLoansSubTypes | null;
  term_length: number | null;
};

export interface IAccountLiability {
  mch_id: string;
  mask: string | null;
  ownership: TAccountOwnership | null;
  fingerprint: string| null;
  type: TAccountLiabilityTypes | null;
  name: string | null;
};

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAchAccountSubTypes;
};

export interface IAccountBalance {
  id: string;
  account_id: string;
  status: TResourceStatus;
  amount: number | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IAccountCardBrandInfo {
  art_id: string;
  url: string;
  name: string;
};

export interface IAccountCardBrand {
  id: string;
  account_id: string;
  network: string | null;
  issuer: string | null;
  last4: string | null;
  brands: IAccountCardBrandInfo[];
  status: 'completed' | 'failed';
  shared: boolean;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IAccountPayoff {
  id: string,
  account_id: string,
  status: TResourceStatus,
  amount: number | null,
  term: number | null,
  per_diem_amount: number | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
};

export const AccountSensitiveFields = {
  auto_loan_number: 'auto_loan.number',
  mortgage_number: 'mortgage.number',
  personal_loan_number: 'personal_loan.number',
  credit_card_number: 'credit_card.number',
  credit_card_billing_zip_code: 'credit_card.billing_zip_code',
  credit_card_exp_month: 'credit_card.exp_month',
  credit_card_exp_year: 'credit_card.exp_year',
  credit_card_cvv: 'credit_card.cvv',
} as const;

export type TAccountSensitiveFields = typeof AccountSensitiveFields[keyof typeof AccountSensitiveFields];

export interface IAccountSensitiveLoan {
  number: string;
};

export interface IAccountSensitiveCreditCard {
  number: string | null;
  billing_zip_code: string | null;
  exp_month: string | null;
  exp_year: string | null;
  cvv: string | null;
};

export interface IAccountSensitive {
  id: string;
  account_id: string;
  type: TAccountLiabilityTypes;
  auto_loan?: IAccountSensitiveLoan;
  credit_card?: IAccountSensitiveCreditCard;
  mortgage?: IAccountSensitiveLoan;
  personal_loan?: IAccountSensitiveLoan;
  status: 'completed' | 'failed';
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IAccountSensitiveCreateOpts {
  expand: TAccountSensitiveFields[];
};

export const AccountSubscriptionStatuses = {
  active: 'active',
  inactive: 'inactive',
};

export type TAccountSubscriptionStatuses = keyof typeof AccountSubscriptionStatuses;

export interface IAccountSubscription {
  id: string;
  name: TAccountSubscriptionTypes;
  status: TAccountSubscriptionStatuses;
  latest_request_id: string | null;
  created_at: string;
  updated_at: string;
};

export interface IAccountSubscriptionsResponse {
  transactions?: IAccountSubscription;
  update?: IAccountSubscription;
  'update.snapshot'?: IAccountSubscription;
};

export interface IAccountSubscriptionCreateOpts {
  enroll: TAccountSubscriptionTypes;
};

export interface IAccountUpdate {
  id: string;
  status: TResourceStatus;
  account_id: string;
  source: TAccountUpdateSources;
  type: TAccountLiabilityTypes;
  auto_loan?: IAccountLiabilityAutoLoan;
  credit_card?: IAccountLiabilityCreditCard;
  collection?: IAccountLiabilityCollection;
  mortgage?: IAccountLiabilityMortgage;
  personal_loan?: IAccountLiabilityPersonalLoan;
  student_loans?: IAccountLiabilityStudentLoans;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export const AccountCurrencyTypes = {
  USD: 'USD',
};

export type TAccountCurrencyTypes = keyof typeof AccountCurrencyTypes;

export const AccountTransactionStatuses = {
  cleared: 'cleared',
  auth: 'auth',
  refund: 'refund',
  unknown: 'unknown',
} as const;

export type TAccountTransactionStatuses = keyof typeof AccountTransactionStatuses;

export interface IAccountTransactionMerchant {
  name: string;
  category_code: string;
  city: string;
  state: string;
  country: string;
  acquirer_bin: string;
  acquirer_card_acceptor_id: string;
};

export interface IAccountTransactionNetworkData {
  visa_merchant_id: string | null;
  visa_merchant_name: string | null;
  visa_store_id: string | null;
  visa_store_name: string | null;
};

export interface IAccountTransaction {
  id: string;
  account_id: string;
  merchant: IAccountTransactionMerchant;
  network: string;
  network_data: IAccountTransactionNetworkData | null;
  amount: number;
  currency: TAccountCurrencyTypes;
  billing_amount: number;
  billing_currency: TAccountCurrencyTypes;
  status: TAccountTransactionStatuses;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export const AccountVerificationSessionStatuses = {
  pending: 'pending',
  in_progress: 'in_progress',
  verified: 'verified',
  failed: 'failed',
} as const;

export type TAccountVerificationSessionStatuses = keyof typeof AccountVerificationSessionStatuses;

export const AccountVerificationSessionTypes = {
  micro_deposits: 'micro_deposits',
  plaid: 'plaid',
  mx: 'mx',
  teller: 'teller',
  standard: 'standard',
  instant: 'instant',
  pre_auth: 'pre_auth',
} as const;

export type TAccountVerificaionSessionTypes = keyof typeof AccountVerificationSessionTypes;

export const AccountVerificationCheckStatusTypes = {
  pass: 'pass',
  fail: 'fail',
} as const;

export type TAccountVerificationPassFail = keyof typeof AccountVerificationCheckStatusTypes;

export interface IAccountVerificationSessionMicroDeposits {
  amounts: number[] | [];
};

export interface IAccountVerificaitonSessionPlaid {
  balances: IPlaidBalance | {};
  transactions: IPlaidTransaction[] | [];
};

export interface IAccountVerificationSessionMX {
  account: IMXAccount | {};
  transactions: IMXTransaction[] | [];
};

export interface IAccountVerificationSessionTeller {
  balances: ITellerBalance | {};
  transactions: ITellerTransaction[] | [];
};

// TODO: Implement the following interfaces
export interface IAccountVerificationSessionTrustProvisioner {};
export interface IAccountVerificationSessionAutoVerify {};
export interface IAccountVerificationSessionThreeDS {};
export interface IAccountVerificationSessionIssuer {};

export interface IAccountVerificationSessionStandard {
  number: string;
};

export interface IAccountVerificationSessionInstant {
  exp_year?: string | null;
  exp_month?: string | null;
  exp_check?: TAccountVerificationPassFail | null;
  number?: string | null;
};

export interface IAccountVerificationSessionPreAuth extends IAccountVerificationSessionInstant {
  cvv?: string | null;
  cvv_check?: TAccountVerificationPassFail | null;
  billing_zip_code?: string | null;
  billing_zip_code_check?: TAccountVerificationPassFail | null;
  pre_auth_check?: TAccountVerificationPassFail | null;
};

export interface IAccountVerificationSessionCreateOpts {
  type: TAccountVerificaionSessionTypes;
};

export interface IAccountVerificationSessionMicroDepositsUpdateOpts {
  micro_deposits: IAccountVerificationSessionMicroDeposits;
};

export interface IAccountVerificationSessionPlaidUpdateOpts {
  plaid: IAccountVerificaitonSessionPlaid;
};

export interface IAccountVerificationSessionMXUpdateOpts {
  mx: IAccountVerificationSessionMX;
};

export interface IAccountVerificationSessionTellerUpdateOpts {
  teller: IAccountVerificationSessionTeller;
};

export interface IAccountVerificationSessionStandardUpdateOpts {
  standard: IAccountVerificationSessionStandard;
};

export interface IAccountVerificationSessionInstantUpdateOpts {
  instant: IAccountVerificationSessionInstant;
};

export interface IAccountVerificationSessionPreAuthUpdateOpts {
  pre_auth: IAccountVerificationSessionPreAuth
};

export type IAccountVerificationSessionUpdateOpts =
  | IAccountVerificationSessionMicroDepositsUpdateOpts
  | IAccountVerificationSessionPlaidUpdateOpts
  | IAccountVerificationSessionMXUpdateOpts
  | IAccountVerificationSessionTellerUpdateOpts
  | IAccountVerificationSessionStandardUpdateOpts
  | IAccountVerificationSessionInstantUpdateOpts
  | IAccountVerificationSessionPreAuthUpdateOpts;

export interface IAccountVerificationSession {
  id: string;
  account_id: string;
  status: TAccountVerificationSessionStatuses;
  type: TAccountVerificaionSessionTypes;
  error: IResourceError | null;
  plaid?: IAccountVerificaitonSessionPlaid | null;
  mx?: IAccountVerificationSessionMX | null;
  teller?: IAccountVerificationSessionTeller | null;
  micro_deposits?: IAccountVerificationSessionMicroDeposits | null;
  trusted_provisioner?: IAccountVerificationSessionTrustProvisioner | null;
  auto_verify?: IAccountVerificationSessionAutoVerify | null;
  standard?: IAccountVerificationSessionStandard | null;
  instant?: IAccountVerificationSessionInstant | null;
  pre_auth?: IAccountVerificationSessionPreAuth | null;
  three_ds?: IAccountVerificationSessionThreeDS | null;
  issuer?: IAccountVerificationSessionIssuer | null;
  created_at: string;
  updated_at: string; 
};

export interface IAccountCreateOpts {
  holder_id: string;
  metadata?: {};
};

export interface IACHCreateOpts extends IAccountCreateOpts {
  ach: IAccountACH;
};

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string;
    account_number?: string;
    number?: string;
  }
};

export interface IAccountListOpts<T extends TAccountExpandableFields> extends IResourceListOpts {
  status?: string | null;
  type?: string | null;
  holder_id?: string | null;
  expand?: T[];
  'liability.mch_id'?: string | null;
  'liability.type'?: TAccountLiabilityTypes | null;
  'liability.ownership'?: TAccountOwnership | null;
};

export interface IAccountWithdrawConsentOpts {
  type: 'withdraw';
  reason: 'holder_withdrew_consent' | null;
};

export interface IAccount {
  id: string;
  holder_id: string;
  status: TAccountStatuses;
  type: TAccountTypes | null;
  ach?: IAccountACH | null;
  liability?: IAccountLiability | null;
  products: TAccountProducts[];
  restricted_products: TAccountProducts[];
  subscriptions?: TAccountSubscriptionTypes[];
  available_subscriptions?: TAccountSubscriptionTypes[];
  restricted_subscriptions?: TAccountSubscriptionTypes[];
  sensitive?: string | IAccountSensitive | null;
  balance?: string | IAccountBalance | null;
  card_brand?: string | IAccountCardBrand | null;
  payoff?: string | IAccountPayoff | null;
  transactions?: string | IAccountTransaction[] | null;
  update?: string | IAccountUpdate | null;
  latest_verification_session?: string | IAccountVerificationSession | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
};

export * from './externalTypes'
