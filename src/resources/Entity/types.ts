import { IResourceError } from "../../resource";
import EntityProducts, { TEntityProductType } from "./Products";
import { TEntitySubscriptionNames } from "./Subscriptions";

export const CreditReportBureaus = {
  experian: 'experian',
  equifax: 'equifax',
  transunion: 'transunion',
};

export type TCreditReportBureaus = keyof typeof CreditReportBureaus;

export const EntityTypes = {
  individual: 'individual',
  c_corporation: 'c_corporation',
  s_corporation: 's_corporation',
  llc: 'llc',
  partnership: 'partnership',
  sole_proprietorship: 'sole_proprietorship',
  receive_only: 'receive_only',
};

export type TEntityTypes = keyof typeof EntityTypes;

export const EntityCapabilities = {
  payments_send: 'payments:send',
  payments_receive: 'payments:receive',
  payments_limited_send: 'payments:limited-send',
  data_retrieve: 'data:retrieve',
  data_sync: 'data:sync',
  transaction_stream: 'transaction:stream',
} as const;

export type TEntityCapabilities = typeof EntityCapabilities[keyof typeof EntityCapabilities];

export const EntityStatuses = {
  active: 'active',
  incomplete: 'incomplete',
  disabled: 'disabled',
};

export type TEntityStatuses = keyof typeof EntityStatuses;

export const EntityVerificationIdentityMethods = {
  kba: 'kba',
  byo_kyc: 'byo_kyc',
  element: 'element',
};

export type TEntityVerificationIdentityMethods = keyof typeof EntityVerificationIdentityMethods;

export const EntityVerificationPhoneMethods = {
  sms: 'sms',
  sna: 'sna',
  byo_sms: 'byo_sms',
  element: 'element',
};

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

export interface IEntityReceiveOnly {
  name: string;
  phone: string | null;
  email: string | null;
};

export interface IEntityKYCAddressRecordData {
  address: string;
  city: string;
  postal_code: string;
  state: string;
  address_term: number;
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

export interface IEntity {
  id: string;
  type: TEntityTypes;
  individual?: IEntityIndividual | null;
  corporation?: IEntityCorporation | null;
  address: IEntityAddress;
  status: TEntityStatuses;
  error: IResourceError | null;
  metadata: {} | null;
  products?: TEntityProductType[];
  restricted_products?: TEntityProductType[];
  subscriptions?: TEntitySubscriptionNames[];
  available_subscriptions?: TEntitySubscriptionNames[];
  restricted_subscriptions?: TEntitySubscriptionNames[];
  verification?: IEntityVerification;
  connect: string | null;
  credit_score: string | null;
  created_at: string;
  updated_at: string;
};
