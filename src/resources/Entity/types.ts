import { IResourceError } from "../../resource";

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
  
  export const EntityIndividualPhoneVerificationTypes = {
    method_sms: 'method_sms',
    method_verified: 'method_verified',
    sms: 'sms',
    tos: 'tos',
  };
  
  export type TEntityIndividualPhoneVerificationTypes = keyof typeof EntityIndividualPhoneVerificationTypes;
  
  export interface IEntityIndividual {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email: string | null;
    dob: string | null;
    ssn: string | null;
    ssn_4: string | null;
    phone_verification_type: TEntityIndividualPhoneVerificationTypes | null,
    phone_verification_timestamp: Date | null,
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
  
  export interface IEntity {
    id: string;
    type: TEntityTypes;
    individual: IEntityIndividual | null;
    corporation: IEntityCorporation | null;
    receive_only: IEntityReceiveOnly | null;
    capabilities: TEntityCapabilities[];
    available_capabilities: TEntityCapabilities[];
    pending_capabilities: TEntityCapabilities[];
    address: IEntityAddress;
    status: TEntityStatuses;
    error: IResourceError | null;
    metadata: {} | null;
    created_at: string;
    updated_at: string;
  };
  