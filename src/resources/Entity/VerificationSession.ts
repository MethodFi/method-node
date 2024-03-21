import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const EntityVerificationSessionStatuses = {
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  failed: 'failed',
};

export type IEntityVerificationSessionStatuses =
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'failed';

export const EntityVerificationSessionTypes = {
  phone_method_sms: 'phone_method_sms',
  phone_method_sna: 'phone_method_sna',
  phone_byo_sms: 'phone_byo_sms',
  identity_byo_kyc: 'identity_byo_kyc',
  identity_method_kba: 'identity_method_kba',
  identity_method_auth_element: 'identity_method_auth_element',
};

export type IEntityVerificationSessionTypes =
  |'phone_method_sms'
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
  |'phone'
  | 'identity';

export interface IEntityPhoneSmsVerification {
  timestamp: Date;
}

export interface IEntityPhoneSmsVerificationUpdate {
  sms_code: string;
}

export interface IEntityPhoneSnaVerification {
  urls: string;
}

export interface IEntityIdentityByoKycVerification {
  authenticated: boolean;
}

export interface IEntityIdentityMethodKbaVerificationAnswer {
  id: string;
  text: string;
}

export interface IEntityIdentityMethodKbaVerificationAnswerUpdate {
  question_id: string;
  answer_id: string;
}

export interface IEntityIdentityMethodKbaVerificationQuestion {
  selected_answer?: string;
  id: string;
  text: string;
  answers: IEntityIdentityMethodKbaVerificationAnswer[];
}

export interface IEntityIdentityMethodKbaVerification {
  questions: IEntityIdentityMethodKbaVerificationQuestion[];
  authenticated: boolean;
}

export interface IEntityVerificationSessionCreateOpts {
  type: IEntityVerificationSessionTypes;
  phone_method_sms?: {};
  phone_method_sna?: {};
  phone_byo_sms?: IEntityPhoneSmsVerification;
  identity_byo_kyc?: {};
  identity_method_kba?: {};
}

export interface IEntityVerificationSessionUpdateOpts {
  type: IEntityVerificationSessionTypes;
  phone_method_sms?: IEntityPhoneSmsVerificationUpdate;
  phone_method_sna?: {};
  identity_method_kba?: IEntityIdentityMethodKbaVerificationAnswerUpdate;
}

export interface IEntityVerificationSession {
  id: string;
  entity_id: string;
  status: IEntityVerificationSessionStatuses;
  type: IEntityVerificationSessionTypes;
  category: IEntityVerificationSessionCategories;
  phone_method_sms: IEntityPhoneSmsVerification | null;
  phone_method_sna: IEntityPhoneSnaVerification | null;
  phone_byo_sms: IEntityPhoneSmsVerification | null;
  identity_byo_kyc: IEntityIdentityByoKycVerification | null
  identity_method_kba: IEntityIdentityMethodKbaVerification | null;
  identity_method_auth_element: IEntityIdentityMethodKbaVerification | null;
  error: IResourceError | null;
  created_at: Date;
  updated_at: Date;
}

export default class EntityVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Retrieve a verification session
   * 
   * @param evf_id id of the verification session
   * @returns IEntityVerificationSession
   */

  async retrieve(evf_id: string) {
    return super._getWithId<IEntityVerificationSession>(evf_id);
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
   * Update a verification session
   * 
   * @param evf_id Verification session id
   * @param data IEntityVerificationSessionUpdateOpts
   * @returns IEntityVerificationSession
   */

  async update(evf_id: string, data: IEntityVerificationSessionUpdateOpts) {
    return super._updateWithId<IEntityVerificationSession, IEntityVerificationSessionUpdateOpts>(evf_id, data);
  }
}