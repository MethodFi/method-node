import Resource, { IResourceError, TResourceStatus } from '../../resource';
import Configuration from '../../configuration';

export const EntityVerificationSessionTypes = {
  phone_method_sms: 'phone_method_sms',
  phone_method_sna: 'phone_method_sna',
  phone_byo_sms: 'phone_byo_sms',
  identity_byo_kyc: 'identity_byo_kyc',
  identity_method_kba: 'identity_method_kba',
  identity_method_auth_element: 'identity_method_auth_element',
};

export type IEntityVerificationSessionTypes =
  | 'phone_method_sms'
  | 'phone_method_sna'
  | 'phone_byo_sms'
  | 'identity_byo_kyc'
  | 'identity_method_kba'
  | 'identity_method_auth_element';

export const EntityVerificationSessionCategories = {
  phone: 'phone',
  identity: 'identity',
};

export type IEntityVerificationSessionCategories =
  | 'phone'
  | 'identity';

export interface IEntitySmsVerification {
  timestamp: Date;
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
  phone_method_sms?: {};
  phone_method_sna?: {};
  phone_byo_sms?: IEntitySmsVerification;
  identity_byo_kyc?: {};
  identity_method_kba?: {};
};

export interface IEntityVerificationSessionUpdateOpts {
  type: IEntityVerificationSessionTypes;
  phone_method_sms?: IEntitySmsVerificationUpdate;
  phone_method_sna?: {};
  identity_method_kba?: IEntityKbaVerificationAnswerUpdate;
};

export interface IEntityVerificationSession {
  id: string;
  entity_id: string;
  status: TResourceStatus;
  type: IEntityVerificationSessionTypes;
  category: IEntityVerificationSessionCategories;
  phone_method_sms: IEntitySmsVerification | null;
  phone_method_sna: IEntitySnaVerification | null;
  phone_byo_sms: IEntitySmsVerification | null;
  identity_byo_kyc: IEntityByoKycVerification | null
  identity_method_kba: IEntityKbaVerification | null;
  identity_method_auth_element: IEntityKbaVerification | null;
  error: IResourceError | null;
  created_at: Date;
  updated_at: Date;
};

export default class EntityVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Create a verification session
   * 
   * @param data IEntityVerificationSessionCreateOpts
   * @returns IEntityVerificationSession
   */

  async create(data: IEntityVerificationSessionCreateOpts) {
    return super._create<IEntityVerificationSession, IEntityVerificationSessionCreateOpts>(data);
  }

  /**
   * Retrieves a EntityVerificationSession for an entity.
   * 
   * @param evf_id id of the verification session
   * @returns Returns an EntityVerificationSession object.
   */

  async retrieve(evf_id: string) {
    return super._getWithId<IEntityVerificationSession>(evf_id);
  }

  /**
   * Update a verification session
   * 
   * @param evf_id Verification session id
   * @param data IEntityVerificationSessionUpdateOpts
   * @returns IEntityVerificationSession
   */

  async update(evf_id: string, data: IEntityVerificationSessionUpdateOpts) {
    return super._updateWithId<IEntityVerificationSession, IEntityVerificationSessionUpdateOpts>(evf_id, data);
  }
};
