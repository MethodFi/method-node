import type {
  IResourceError,
  TResourceStatus,
  IResourceListOpts,
} from '../../resource';
import { TAccountProducts, TAccountSubscriptionTypes } from '../Account';

export const CreditReportBureaus = {
  experian: 'experian',
  equifax: 'equifax',
  transunion: 'transunion',
} as const;

export type TCreditReportBureaus = keyof typeof CreditReportBureaus;

export const EntityTypes = {
  individual: 'individual',
  corporation: 'corporation',
} as const;

export type TEntityTypes = keyof typeof EntityTypes;

export const EntityStatuses = {
  active: 'active',
  incomplete: 'incomplete',
  disabled: 'disabled',
} as const;

export type TEntityStatuses = keyof typeof EntityStatuses;

export const EntityVerificationIdentityMethods = {
  kba: 'kba',
  byo_kyc: 'byo_kyc',
  element: 'element',
  opal: 'opal',
} as const;

export type TEntityVerificationIdentityMethods = keyof typeof EntityVerificationIdentityMethods;

export const EntityVerificationPhoneMethods = {
  sms: 'sms',
  sna: 'sna',
  byo_sms: 'byo_sms',
  element: 'element',
  opal: 'opal',
} as const;

export type TEntityVerificationPhoneMethods = keyof typeof EntityVerificationPhoneMethods;

export interface IEntityIndividual {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  dob: string | null;
  ssn: string | null;
  ssn_4: string | null;
};

export interface IEntityAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
};

export interface IEntityCorporationOwner {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  dob: string | null;
  address: IEntityAddress;
};

export interface IEntityCorporation {
  name: string | null;
  dba: string | null;
  ein: string | null;
  owners: IEntityCorporationOwner[];
};

export interface IEntityKYCAddressRecordData {
  address: string;
  city: string;
  postal_code: string;
  state: string;
};

export interface IEntityIdentityType {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  dob: string | null;
  address: IEntityKYCAddressRecordData | null;
  ssn: string | null;
};

export interface IEntityVerificationIdentity {
  verified: boolean;
  matched: boolean;
  latest_verification_session: string | null;
  methods: TEntityVerificationIdentityMethods[];
};

export interface IEntityVerificationPhone {
  verified: boolean;
  latest_verification_session: string | null;
  methods: TEntityVerificationPhoneMethods[];
};

export interface IEntityVerification {
  identity?: IEntityVerificationIdentity;
  phone?: IEntityVerificationPhone;
};

export const EntityConnectArtifactTypes = {
  raw_credit_report: 'raw_credit_report',
  credit_report_pdf: 'credit_report_pdf',
} as const;

export type TEntityConnectArtifactTypes = typeof EntityConnectArtifactTypes[keyof typeof EntityConnectArtifactTypes];

export const EntityConnectFileBureaus = {
  equifax: 'equifax',
  transunion: 'transunion',
} as const;

export type TEntityConnectFileBureaus = typeof EntityConnectFileBureaus[keyof typeof EntityConnectFileBureaus];

export interface IEntityConnectFile {
  id: string;
  type: TEntityConnectArtifactTypes;
  bureau: TEntityConnectFileBureaus;
  mime_type: string;
};

export interface IEntityConnect {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  accounts: string[] | null;
  requested_products: TAccountProducts[];
  requested_subscriptions: TAccountSubscriptionTypes[];
  files: IEntityConnectFile[];
  credit_reports?: Record<string, unknown> | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export const CreditScoresModel = {
  vantage_4: 'vantage_4',
  vantage_3: 'vantage_3',
} as const;

export type TCreditScoresModel = keyof typeof CreditScoresModel;

export interface IEntityCreditScoresFactorsType {
  code: string,
  description: string,
};

export interface IEntityCreditScoresType {
  score: number,
  source: TCreditReportBureaus,
  model: TCreditScoresModel,
  factors: IEntityCreditScoresFactorsType[],
  created_at: string,
};

export interface IEntityCreditScores {
  id: string,
  entity_id: string,
  status: TResourceStatus,
  scores: IEntityCreditScoresType[] | null,
  error: IResourceError | null,
  created_at: string,
  updated_at: string,
};

export interface IEntityAttribute<T> {
  value: T | null;
  error: IResourceError | null;
  metadata: Record<string, unknown> | null;
}

export interface ICreditHealthAttribute<T> {
  value: T | null;
  rating: string;
  metadata?: Record<string, unknown> | null;
}

export interface IEntityAttributesType {
  revolving_credit_card_balance_total?: IEntityAttribute<number>;
  credit_limit_total?: IEntityAttribute<number>;
  credit_card_utilization?: IEntityAttribute<number>;
  available_credit_limit_total?: IEntityAttribute<number>;
  available_credit_total?: IEntityAttribute<number>;
  weighted_average_apr_credit_card?: IEntityAttribute<number>;
  usage_pattern?: IEntityAttribute<string>;
  utilization?: IEntityAttribute<number>;
  purchasing_power?: IEntityAttribute<number>;
  healthy_cards_count?: IEntityAttribute<number>;
  dormant_cards_count?: IEntityAttribute<number>;
  delinquent_cards_count?: IEntityAttribute<number>;
  net_active_cards_count?: IEntityAttribute<number>;
  utilization_velocity_4_week?: IEntityAttribute<string>;
  utilization_velocity_8_week?: IEntityAttribute<string>;
  utilization_velocity_12_week?: IEntityAttribute<string>;
  next_payment_minimum_total_credit_cards?: IEntityAttribute<number>;
  payment_to_minimum_ratio_avg_credit_cards?: IEntityAttribute<number>;
  revolving_credit_card_balance_change_30d?: IEntityAttribute<number>;
  revolving_credit_card_balance_change_60d?: IEntityAttribute<number>;
  revolving_credit_card_balance_change_90d?: IEntityAttribute<number>;
  revolving_credit_card_utilization_trend_30d?: IEntityAttribute<number>;
  revolving_credit_card_utilization_trend_90d?: IEntityAttribute<number>;
  revolving_credit_card_utilization_delta_30d?: IEntityAttribute<number>;
  revolving_credit_card_utilization_delta_60d?: IEntityAttribute<number>;
  revolving_credit_card_utilization_delta_90d?: IEntityAttribute<number>;
  delinquency_flag_credit_cards?: IEntityAttribute<string>;
  any_delinquent_flag?: IEntityAttribute<boolean>;
  serious_delinquent_flag?: IEntityAttribute<boolean>;
  delinquency_recently_cured_flag?: IEntityAttribute<boolean>;
  delinquency_worst_dpd_bucket?: IEntityAttribute<string>;
  delinquency_accounts_count?: IEntityAttribute<number>;
  delinquent_balance_total?: IEntityAttribute<number>;
  delinquency_progression_flag?: IEntityAttribute<boolean>;
  delinquent_outcome?: IEntityAttribute<string>;
  personal_loan_balance_total?: IEntityAttribute<number>;
  personal_loan_amount_total?: IEntityAttribute<number>;
  available_loan_amount_personal_loans?: IEntityAttribute<number>;
  personal_loan_monthly_installments_estimate?: IEntityAttribute<number>;
  personal_loan_utilization?: IEntityAttribute<number>;
  weighted_average_apr_personal_loan?: IEntityAttribute<number>;
  personal_loan_balance_change_30d?: IEntityAttribute<number>;
  personal_loan_balance_change_60d?: IEntityAttribute<number>;
  personal_loan_balance_change_90d?: IEntityAttribute<number>;
  personal_loan_utilization_trend_30d?: IEntityAttribute<number>;
  personal_loan_utilization_trend_90d?: IEntityAttribute<number>;
  personal_loan_utilization_delta_30d?: IEntityAttribute<number>;
  personal_loan_utilization_delta_60d?: IEntityAttribute<number>;
  personal_loan_utilization_delta_90d?: IEntityAttribute<number>;
  mortgage_balance_total?: IEntityAttribute<number>;
  mortgage_loan_amount_total?: IEntityAttribute<number>;
  weighted_average_apr_mortgage?: IEntityAttribute<number>;
  mortgage_balance_change_30d?: IEntityAttribute<number>;
  mortgage_balance_change_60d?: IEntityAttribute<number>;
  mortgage_balance_change_90d?: IEntityAttribute<number>;
  mortgage_utilization_trend_30d?: IEntityAttribute<number>;
  mortgage_utilization_trend_90d?: IEntityAttribute<number>;
  mortgage_utilization_delta_30d?: IEntityAttribute<number>;
  mortgage_utilization_delta_60d?: IEntityAttribute<number>;
  mortgage_utilization_delta_90d?: IEntityAttribute<number>;
  heloc_balance_total?: IEntityAttribute<number>;
  heloc_utilization?: IEntityAttribute<number>;
  overall_loan_amount_total?: IEntityAttribute<number>;
  overall_utilization?: IEntityAttribute<number>;
  overall_utilization_trend_30d?: IEntityAttribute<number>;
  overall_utilization_trend_90d?: IEntityAttribute<number>;
  overall_utilization_delta_30d?: IEntityAttribute<number>;
  overall_utilization_delta_60d?: IEntityAttribute<number>;
  overall_utilization_delta_90d?: IEntityAttribute<number>;
  installment_balance_total?: IEntityAttribute<number>;
  installment_balance_change_30d?: IEntityAttribute<number>;
  installment_balance_change_60d?: IEntityAttribute<number>;
  installment_balance_change_90d?: IEntityAttribute<number>;
  other_balance_total?: IEntityAttribute<number>;
  other_balance_change_30d?: IEntityAttribute<number>;
  other_balance_change_60d?: IEntityAttribute<number>;
  other_balance_change_90d?: IEntityAttribute<number>;
  enrolled_in_direct_pay_previously?: IEntityAttribute<boolean>;
  last_direct_pay_date?: IEntityAttribute<string>;
  last_direct_pay_amount?: IEntityAttribute<number>;
  number_of_direct_pay_in_12_months?: IEntityAttribute<number>;
  credit_health_credit_card_usage?: ICreditHealthAttribute<number>;
  credit_health_derogatory_marks?: ICreditHealthAttribute<number>;
  credit_health_hard_inquiries?: ICreditHealthAttribute<number>;
  credit_health_soft_inquiries?: ICreditHealthAttribute<number>;
  credit_health_total_accounts?: ICreditHealthAttribute<number>;
  credit_health_credit_age?: ICreditHealthAttribute<number>;
  credit_health_payment_history?: ICreditHealthAttribute<number>;
  credit_health_open_accounts?: ICreditHealthAttribute<number>;
  credit_health_entity_delinquent?: ICreditHealthAttribute<number>;
}

// These v1 attributes can still appear on historical responses, but the v2
// 2026-03-30 create validators do not accept them as requested_attributes.
export const LegacyEntityAttributeNames = {
  credit_health_credit_card_usage: 'credit_health_credit_card_usage',
  credit_health_derogatory_marks: 'credit_health_derogatory_marks',
  credit_health_hard_inquiries: 'credit_health_hard_inquiries',
  credit_health_soft_inquiries: 'credit_health_soft_inquiries',
  credit_health_total_accounts: 'credit_health_total_accounts',
  credit_health_credit_age: 'credit_health_credit_age',
  credit_health_payment_history: 'credit_health_payment_history',
  credit_health_open_accounts: 'credit_health_open_accounts',
  credit_health_entity_delinquent: 'credit_health_entity_delinquent',
} as const;

export type TLegacyEntityAttributeNames = typeof LegacyEntityAttributeNames[keyof typeof LegacyEntityAttributeNames];

export const EntityAttributeNames = {
  revolving_credit_card_balance_total: 'revolving_credit_card_balance_total',
  credit_limit_total: 'credit_limit_total',
  credit_card_utilization: 'credit_card_utilization',
  available_credit_limit_total: 'available_credit_limit_total',
  available_credit_total: 'available_credit_total',
  weighted_average_apr_credit_card: 'weighted_average_apr_credit_card',
  usage_pattern: 'usage_pattern',
  utilization: 'utilization',
  purchasing_power: 'purchasing_power',
  healthy_cards_count: 'healthy_cards_count',
  dormant_cards_count: 'dormant_cards_count',
  delinquent_cards_count: 'delinquent_cards_count',
  net_active_cards_count: 'net_active_cards_count',
  utilization_velocity_4_week: 'utilization_velocity_4_week',
  utilization_velocity_8_week: 'utilization_velocity_8_week',
  utilization_velocity_12_week: 'utilization_velocity_12_week',
  next_payment_minimum_total_credit_cards: 'next_payment_minimum_total_credit_cards',
  payment_to_minimum_ratio_avg_credit_cards: 'payment_to_minimum_ratio_avg_credit_cards',
  revolving_credit_card_balance_change_30d: 'revolving_credit_card_balance_change_30d',
  revolving_credit_card_balance_change_60d: 'revolving_credit_card_balance_change_60d',
  revolving_credit_card_balance_change_90d: 'revolving_credit_card_balance_change_90d',
  revolving_credit_card_utilization_trend_30d: 'revolving_credit_card_utilization_trend_30d',
  revolving_credit_card_utilization_trend_90d: 'revolving_credit_card_utilization_trend_90d',
  revolving_credit_card_utilization_delta_30d: 'revolving_credit_card_utilization_delta_30d',
  revolving_credit_card_utilization_delta_60d: 'revolving_credit_card_utilization_delta_60d',
  revolving_credit_card_utilization_delta_90d: 'revolving_credit_card_utilization_delta_90d',
  delinquency_flag_credit_cards: 'delinquency_flag_credit_cards',
  any_delinquent_flag: 'any_delinquent_flag',
  serious_delinquent_flag: 'serious_delinquent_flag',
  delinquency_recently_cured_flag: 'delinquency_recently_cured_flag',
  delinquency_worst_dpd_bucket: 'delinquency_worst_dpd_bucket',
  delinquency_accounts_count: 'delinquency_accounts_count',
  delinquent_balance_total: 'delinquent_balance_total',
  delinquency_progression_flag: 'delinquency_progression_flag',
  delinquent_outcome: 'delinquent_outcome',
  personal_loan_balance_total: 'personal_loan_balance_total',
  personal_loan_amount_total: 'personal_loan_amount_total',
  available_loan_amount_personal_loans: 'available_loan_amount_personal_loans',
  personal_loan_monthly_installments_estimate: 'personal_loan_monthly_installments_estimate',
  personal_loan_utilization: 'personal_loan_utilization',
  weighted_average_apr_personal_loan: 'weighted_average_apr_personal_loan',
  personal_loan_balance_change_30d: 'personal_loan_balance_change_30d',
  personal_loan_balance_change_60d: 'personal_loan_balance_change_60d',
  personal_loan_balance_change_90d: 'personal_loan_balance_change_90d',
  personal_loan_utilization_trend_30d: 'personal_loan_utilization_trend_30d',
  personal_loan_utilization_trend_90d: 'personal_loan_utilization_trend_90d',
  personal_loan_utilization_delta_30d: 'personal_loan_utilization_delta_30d',
  personal_loan_utilization_delta_60d: 'personal_loan_utilization_delta_60d',
  personal_loan_utilization_delta_90d: 'personal_loan_utilization_delta_90d',
  mortgage_balance_total: 'mortgage_balance_total',
  mortgage_loan_amount_total: 'mortgage_loan_amount_total',
  weighted_average_apr_mortgage: 'weighted_average_apr_mortgage',
  mortgage_balance_change_30d: 'mortgage_balance_change_30d',
  mortgage_balance_change_60d: 'mortgage_balance_change_60d',
  mortgage_balance_change_90d: 'mortgage_balance_change_90d',
  mortgage_utilization_trend_30d: 'mortgage_utilization_trend_30d',
  mortgage_utilization_trend_90d: 'mortgage_utilization_trend_90d',
  mortgage_utilization_delta_30d: 'mortgage_utilization_delta_30d',
  mortgage_utilization_delta_60d: 'mortgage_utilization_delta_60d',
  mortgage_utilization_delta_90d: 'mortgage_utilization_delta_90d',
  heloc_balance_total: 'heloc_balance_total',
  heloc_utilization: 'heloc_utilization',
  overall_loan_amount_total: 'overall_loan_amount_total',
  overall_utilization: 'overall_utilization',
  overall_utilization_trend_30d: 'overall_utilization_trend_30d',
  overall_utilization_trend_90d: 'overall_utilization_trend_90d',
  overall_utilization_delta_30d: 'overall_utilization_delta_30d',
  overall_utilization_delta_60d: 'overall_utilization_delta_60d',
  overall_utilization_delta_90d: 'overall_utilization_delta_90d',
  installment_balance_total: 'installment_balance_total',
  installment_balance_change_30d: 'installment_balance_change_30d',
  installment_balance_change_60d: 'installment_balance_change_60d',
  installment_balance_change_90d: 'installment_balance_change_90d',
  other_balance_total: 'other_balance_total',
  other_balance_change_30d: 'other_balance_change_30d',
  other_balance_change_60d: 'other_balance_change_60d',
  other_balance_change_90d: 'other_balance_change_90d',
  enrolled_in_direct_pay_previously: 'enrolled_in_direct_pay_previously',
  last_direct_pay_date: 'last_direct_pay_date',
  last_direct_pay_amount: 'last_direct_pay_amount',
  number_of_direct_pay_in_12_months: 'number_of_direct_pay_in_12_months',
  ...LegacyEntityAttributeNames,
} as const;

export type TEntityAttributeNames = typeof EntityAttributeNames[keyof typeof EntityAttributeNames];
export type TEntityRequestableAttributeNames = Exclude<TEntityAttributeNames, TLegacyEntityAttributeNames>;

export const EntityAttributeBundles = {
  portfolio_intelligence: 'portfolio_intelligence',
  wallet_intelligence: 'wallet_intelligence',
} as const;

export type TEntityAttributeBundles = typeof EntityAttributeBundles[keyof typeof EntityAttributeBundles];

export interface IEntityAttributesCreateOpts {
  requested_attributes?: TEntityRequestableAttributeNames[];
  bundles?: TEntityAttributeBundles[];
}

export interface IEntityAttributes {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  attributes: IEntityAttributesType | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export interface IEntityVehiclesType {
  vin: string | null;
  year: string | null;
  make: string | null;
  model: string | null;
  series: string | null;
  major_color: string | null;
  style: string | null;
};

export interface IEntityVehicles {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  vehicles: IEntityVehiclesType[] | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IEntityIdentity {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  identities: IEntityIdentityType[];
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export const EntityProductTypeStatuses = {
  unavailable: 'unavailable',
  available: 'available',
  restricted: 'restricted',
} as const;

export type TEntityProductTypeStatuses = keyof typeof EntityProductTypeStatuses;

export const EntityProductType = {
  connect: 'connect',
  credit_score: 'credit_score',
  identity: 'identity',
  attribute: 'attribute',
  vehicle: 'vehicle',
  manual_connect: 'manual_connect',
} as const;

export type TEntityProductType = keyof typeof EntityProductType;

export interface IEntityProduct {
  name: string;
  status: TEntityProductTypeStatuses;
  status_error: IResourceError | null;
  latest_request_id: string | null;
  latest_successful_request_id: string | null;
  is_subscribable: boolean;
  created_at: string;
  updated_at: string;
};

export interface IEntityProductListResponse {
  connect?: IEntityProduct;
  credit_score?: IEntityProduct;
  identity?: IEntityProduct;
  attribute?: IEntityProduct;
  vehicle?: IEntityProduct;
  manual_connect?: IEntityProduct;
};

export const EntitySubscriptionNames = {
  connect: 'connect',
  credit_score: 'credit_score',
  attribute: 'attribute',
} as const;

export type TEntitySubscriptionNames = keyof typeof EntitySubscriptionNames;

export const EntitySubscriptionStatuses = {
  active: 'active',
  inactive: 'inactive',
} as const;

export type TEntitySubscriptionStatuses = keyof typeof EntitySubscriptionStatuses;

export interface IEntitySubscriptionPayload {
  attributes?: {
    requested_attributes?: TEntityAttributeNames[];
    bundles?: TEntityAttributeBundles[];
    version?: 'v1' | 'v2';
  } | null;
};

export type TEntityAttributeRequestScope =
  | {
    requested_attributes: TEntityRequestableAttributeNames[];
    bundles?: TEntityAttributeBundles[];
  }
  | {
    requested_attributes?: TEntityRequestableAttributeNames[];
    bundles: TEntityAttributeBundles[];
  };

export interface IEntitySubscriptionCreatePayload {
  attributes?: TEntityAttributeRequestScope;
};

export interface IEntitySubscription {
  id: string;
  name: TEntitySubscriptionNames;
  status: TEntitySubscriptionStatuses;
  payload: IEntitySubscriptionPayload | null;
  latest_request_id: string | null;
  created_at: string;
  updated_at: string;
};

export interface IEntitySubscriptionResponse {
  connect?: IEntitySubscription;
  credit_score?: IEntitySubscription;
  attribute?: IEntitySubscription;
};

export interface IEntitySubscriptionCreateOpts {
  enroll: TEntitySubscriptionNames;
  payload?: IEntitySubscriptionCreatePayload;
};

export const EntityVerificationSessionStatuses = {
  pending: 'pending',
  in_progress: 'in_progress',
  verified: 'verified',
  failed: 'failed',
} as const;

export type IEntityVerificationSessionStatuses = keyof typeof EntityVerificationSessionStatuses;

export const EntityVerificationSessionMethods = {
  sms: 'sms',
  sna: 'sna',
  byo_sms: 'byo_sms',
  byo_kyc: 'byo_kyc',
  kba: 'kba',
  element: 'element',
  method_verified: 'method_verified',
} as const;

export type IEntityVerificationSessionMethods = keyof typeof EntityVerificationSessionMethods;

export const EntityVerificationSessionTypes = {
  phone: 'phone',
  identity: 'identity',
} as const;

export type IEntityVerificationSessionTypes = keyof typeof EntityVerificationSessionTypes;

export interface IEntitySmsVerification {
  timestamp: string;
};

export interface IEntitySmsVerificationUpdate {
  sms_code: string;
};

export interface IEntitySnaVerification {
  urls: string;
};

export interface IEntityByoKycVerification {
  authenticated: boolean;
};

export interface IEntityKbaVerificationAnswer {
  id: string;
  text: string;
};

export interface IEntityKbaVerificationAnswerUpdate {
  question_id: string;
  answer_id: string;
};

export interface IEntityKbaVerificationQuestion {
  selected_answer?: string;
  id: string;
  text: string;
  answers: IEntityKbaVerificationAnswer[];
};

export interface IEntityKbaVerification {
  questions: IEntityKbaVerificationQuestion[];
  authenticated: boolean;
};

export interface IEntityVerificationSessionCreateOpts {
  type: IEntityVerificationSessionTypes;
  method: IEntityVerificationSessionMethods;
  sms?: {};
  sna?: {};
  byo_sms?: IEntitySmsVerification;
  byo_kyc?: {};
  kba?: {};
};

export interface IEntityVerificationSessionUpdateOpts {
  type: IEntityVerificationSessionTypes;
  method: IEntityVerificationSessionMethods;
  sms?: IEntitySmsVerificationUpdate;
  sna?: {};
  kba?: IEntityKbaVerificationAnswerUpdate;
};

export interface IEntityVerificationSession {
  id: string;
  entity_id: string;
  status: IEntityVerificationSessionStatuses;
  type: IEntityVerificationSessionTypes;
  method: IEntityVerificationSessionMethods;
  sms?: IEntitySmsVerification | null;
  sna?: IEntitySnaVerification | null;
  byo_sms?: IEntitySmsVerification | null;
  byo_kyc?: IEntityByoKycVerification | null
  kba?: IEntityKbaVerification | null;
  element?: IEntityKbaVerification | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export const EntityExpandableFields = {
  connect: 'connect',
  credit_score: 'credit_score',
  attribute: 'attribute',
  vehicle: 'vehicle',
  identity_latest_verification_session: 'identity_latest_verification_session',
  phone_latest_verification_session: 'phone_latest_verification_session',
} as const;

export type TEntityExpandableFields = keyof typeof EntityExpandableFields;

export interface IEntityCreateOpts {
  type: TEntityTypes;
  address?: IEntityAddress | null;
  metadata?: {} | null;
};

export interface IIndividualCreateOpts extends IEntityCreateOpts {
  type: 'individual';
  individual: Partial<IEntityIndividual>;
};

export interface ICorporationCreateOpts extends IEntityCreateOpts {
  type: 'corporation';
  corporation: Partial<IEntityCorporation>;
};

export interface IEntityUpdateOpts {
  address?: IEntityAddress;
  corporation?: Partial<IEntityCorporation>;
  individual?: Partial<IEntityIndividual>;
};

export interface IEntityListOpts<T extends TEntityExpandableFields> extends IResourceListOpts {
  status?: string | null;
  type?: string | null;
  expand?: T[];
};

export interface IEntityWithdrawConsentOpts {
  type: 'withdraw',
  reason: 'entity_withdrew_consent' | null,
};

export interface IEntity {
  id: string;
  type: TEntityTypes | null;
  individual?: IEntityIndividual | null;
  corporation?: IEntityCorporation | null;
  address: IEntityAddress | {};
  status: TEntityStatuses;
  error: IResourceError | null;
  metadata: {} | null;
  products?: TEntityProductType[];
  restricted_products?: TEntityProductType[];
  subscriptions?: TEntitySubscriptionNames[];
  available_subscriptions?: TEntitySubscriptionNames[];
  restricted_subscriptions?: TEntitySubscriptionNames[];
  verification?: IEntityVerification | null;
  connect?: string | IEntityConnect | null;
  credit_score?: string| IEntityCreditScores | null;
  attribute?: string | IEntityAttributes | null;
  vehicle?: string | IEntityVehicles | null;
  created_at: string;
  updated_at: string;
};
