import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const EntityVerificationSessionStatuses = {
  pending: 'pending',
  in_progress: 'in_progress',
  verified: 'verified',
  failed: 'failed',
};

export type IEntityVerificationSessionStatuses = keyof typeof EntityVerificationSessionStatuses;

export const EntityVerificationSessionMethods = {
  sms: 'sms',
  sna: 'sna',
  byo_sms: 'byo_sms',
  byo_kyc: 'byo_kyc',
  kba: 'kba',
  element: 'element',
};

export type IEntityVerificationSessionMethods = keyof typeof EntityVerificationSessionMethods;

export const EntityVerificationSessionTypes = {
  phone: 'phone',
  identity: 'identity',
};

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
  type: IEntityVerificationSessionMethods;
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

export default class EntityVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Retrieves a EntityVerificationSession for an entity.
   * 
   * @param evf_id ID of the verification session.
   * @returns Returns an EntityVerificationSession object.
   */

  async retrieve(evf_id: string) {
    return super._getWithId<IEntityVerificationSession>(evf_id);
  }

  /**
   * Create a verification session.
   * 
   * @param data IEntityVerificationSessionCreateOpts
   * @returns Returns an EntityVerificationSession object.
   */

  async create(data: IEntityVerificationSessionCreateOpts) {
    return super._create<IEntityVerificationSession, IEntityVerificationSessionCreateOpts>(data);
  }

  /**
   * Update a verification session
   * 
   * @param evf_id ID of the verification session.
   * @param data IEntityVerificationSessionUpdateOpts
   * @returns Returns an EntityVerificationSession object.
   */

  async update(evf_id: string, data: IEntityVerificationSessionUpdateOpts) {
    return super._updateWithId<IEntityVerificationSession, IEntityVerificationSessionUpdateOpts>(evf_id, data);
  }
};
