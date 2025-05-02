import type {
  IResourceError,
  TResourceStatus,
  IResourceListOpts,
} from '../../resource';

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
} as const;

export type TEntityVerificationIdentityMethods = keyof typeof EntityVerificationIdentityMethods;

export const EntityVerificationPhoneMethods = {
  sms: 'sms',
  sna: 'sna',
  byo_sms: 'byo_sms',
  element: 'element',
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

export interface IEntityConnect {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  accounts: string[] | null;
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

export const CreditHealthAttributeRatings = {
  excellent: 'excellent',
  good: 'good',
  fair: 'fair',
  needs_work: 'needs_work',
} as const;

export type TCreditHealthAttributeRating = keyof typeof CreditHealthAttributeRatings;

export interface ICreditHealthAttribute {
  value: number;
  rating: TCreditHealthAttributeRating;
  metadata?: {} | null;
}

export interface IEntityAttributesType {
  credit_health_credit_card_usage: ICreditHealthAttribute;
  credit_health_derogatory_marks: ICreditHealthAttribute;
  credit_health_hard_inquiries: ICreditHealthAttribute;
  credit_health_soft_inquiries: ICreditHealthAttribute;
  credit_health_total_accounts: ICreditHealthAttribute;
  credit_health_credit_age: ICreditHealthAttribute;
  credit_health_payment_history: ICreditHealthAttribute;
  credit_health_open_accounts: ICreditHealthAttribute;
  credit_health_entity_delinquent: ICreditHealthAttribute;
}

export const EntityAttributeNames = {
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

export type TEntityAttributeNames = keyof typeof EntityAttributeNames;

export interface IEntityAttributesCreateOpts {
  attributes: TEntityAttributeNames[];
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
  id: string;
  name: string;
  status: TEntityProductTypeStatuses;
  status_error: IResourceError | null;
  latest_request_id: string | null;
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
    requested_attributes: TEntityAttributeNames[];
  } | null;
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
  payload?: IEntitySubscriptionPayload;
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
