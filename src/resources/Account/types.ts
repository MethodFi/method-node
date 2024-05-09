import { IResourceError } from "../../resource";
import type { IAccountSensitive } from "./Sensitive";
import type { IAccountBalance } from "./Balances";
import type { IAccountCardBrand } from "./CardBrands";
import type { IAccountPayoff } from "./Payoffs";
import type { IAccountTransaction } from "./Transactions";
import type { IAccountVerificationSession } from "./VerificationSessions";
import type { IAccountUpdate } from "./Updates";

export const AccountTypes = {
  ach: 'ach',
  liability: 'liability',
};

export type TAccountTypes = keyof typeof AccountTypes;

export const AccountStatuses = {
  disabled: 'disabled',
  active: 'active',
  closed: 'closed',
};

export type TAccountStatuses = keyof typeof AccountStatuses;

export const AccountProducts = {
  payment: 'payment',
  balance: 'balance',
  sensitive: 'sensitive',
  card_brand: 'card_brand',
  payoff: 'payoff',
  update: 'update',
};

export type TAccountProducts = keyof typeof AccountProducts;

export const AccountLiabilityPaymentStatuses = {
  active: 'active',
  activating: 'activating',
  unavailable: 'unavailable',
};

export type TAccountLiabilityPaymentStatuses = keyof typeof AccountLiabilityPaymentStatuses;

export const AccountOwnership = {
  primary: 'primary',
  authorized: 'authorized',
  joint: 'joint',
  unknown: 'unknown',
};

export type TAccountOwnership = keyof typeof AccountOwnership;

export const AccountUpdateSources = {
  direct: 'direct',
  snapshot: 'snapshot',
};

export type TAccountAccountUpdateSources = keyof typeof AccountUpdateSources;

export const AccountLiabilityTypes = {
  auto_loan: 'auto_loan',
  credit_card: 'credit_card',
  mortgage: 'mortgage',
  personal_loan: 'personal_loan',
  student_loans: 'student_loans',
  collection: 'collection',
  business_loan: 'business_loan',
  insurance: 'insurance',
  credit_builder: 'credit_builder',
  subscription: 'subscription',
  utility: 'utility',
  medical: 'medical',
  loan: 'loan',
};

export type TAccountLiabilityTypes = keyof typeof AccountLiabilityTypes;

export const AchAccountSubTypes = {
  savings: 'savings',
  checking: 'checking',
};

export type TAchAccountSubTypes = keyof typeof AchAccountSubTypes;

export const AccountExpandableFields = {
  ...AccountProducts,
  latest_verification_session: 'latest_verification_session',
};

export type TAccountExpandableFields = keyof typeof AccountExpandableFields;

export const AccountLiabilityInterestRateTypes = {
  fixed: 'fixed',
  variable: 'variable',
};

export type TAccountLiabilityInterestRateTypes = keyof typeof AccountLiabilityInterestRateTypes;

export const AccountLiabilityInterestRateSources = {
  financial_institution: 'financial_institution',
  public_data: 'public_data',
  method: 'method',
};

export type TAccountLiabilityInterestRateSources = keyof typeof AccountLiabilityInterestRateSources;

export const AccountAutoLoanSubTypes = {
  lease: 'lease',
  loan: 'loan',
};

export type TAccountAutoLoanSubTypes = keyof typeof AccountAutoLoanSubTypes;

export const AccountLiabilityCreditCardSubTypes = {
  flexible_spending: 'flexible_spending',
  charge: 'charge',
  secured: 'secured',
  unsecured: 'unsecured',
  purchase: 'purchase',
  business: 'business',
};

export type TAccountLiabilityCreditCardSubTypes = keyof typeof AccountLiabilityCreditCardSubTypes;

export const AccountLiabilityCreditCardUsageTypes = {
  transactor: 'transactor',
  revolver: 'revolver',
  dormant: 'dormant',
  unknown: 'unknown',
};

export type TAccountLiabilityCreditCardUsageTypes = keyof typeof AccountLiabilityCreditCardUsageTypes;

export const AccountLiabilityMortgageSubTypes = {
  loan: 'loan',
};

export type TAccountLiabilityMortgageSubTypes = keyof typeof AccountLiabilityMortgageSubTypes;

export const AccountLiabilityPersonalLoanSubTypes = {
  secured: 'secured',
  unsecured: 'unsecured',
  heloc: 'heloc',
  line_of_credit: 'line_of_credit',
  note: 'note',
};

export type TAccountLiabilityPersonalLoanSubTypes = keyof typeof AccountLiabilityPersonalLoanSubTypes;

export const AccountLiabilityStudentLoansSubTypes = {
  federal: 'federal',
  private: 'private',
};

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
  mask: string;
  ownership: string;
  fingerprint: string;
  type: string;
  name: string;
}

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAchAccountSubTypes;
};

export interface IAccount {
  id: string;
  holder_id: string;
  status: TAccountStatuses;
  type: TAccountTypes;
  ach?: IAccountACH;
  liability?: IAccountLiability;
  products: TAccountProducts[];
  restricted_products: TAccountProducts[];
  subscriptions?: string[];
  available_subscriptions?: string[];
  restricted_subscriptions?: string[];
  sensitive: string | IAccountSensitive | null;
  balance: string | IAccountBalance | null;
  card_brand: string | IAccountCardBrand | null;
  payoff: string | IAccountPayoff | null;
  transactions: string | IAccountTransaction[] | null;
  update: string | IAccountUpdate | null;
  latest_verification_session: string | IAccountVerificationSession | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
};
