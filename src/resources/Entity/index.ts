import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import EntitySync from "../EntitySync";

export const EntityTypes = {
  individual: 'individual',
  c_corporation: 'c_corporation',
  s_corporation: 's_corporation',
  llc: 'llc',
  partnership: 'partnership',
  sole_proprietorship: 'sole_proprietorship',
  receive_only: 'receive_only',
};

export type TEntityTypes =
  | 'individual'
  | 'c_corporation'
  | 's_corporation'
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship'
  | 'receive_only';

export const EntityCapabilities = {
  payments_send: 'payments:send',
  payments_receive: 'payments:receive',
  payments_limited_send: 'payments:limited-send',
  data_retrieve: 'data:retrieve',
  data_sync: 'data:sync',
};

export type TEntityCapabilities =
  | 'payments:send'
  | 'payments:receive'
  | 'payments:limited-send'
  | 'data:retrieve'
  | 'data:sync';

export const EntityStatuses = {
  active: 'active',
  incomplete: 'incomplete',
  disabled: 'disabled',
};

export type TEntityStatuses =
  | 'active'
  | 'incomplete'
  | 'disabled';

export interface IEntityIndividual {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  dob: string | null;
  ssn?: string,
}

export interface IEntityAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface IEntityCorporationOwner {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  dob: string | null;
  address: IEntityAddress;
}

export interface IEntityCorporation {
  name: string | null;
  dba: string | null;
  ein: string | null;
  owners: IEntityCorporationOwner[];
}

export interface IEntityReceiveOnly {
  name: string;
  phone: string | null;
  email: string | null;
}

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
}

export interface IEntityCreateOpts {
  type: TEntityTypes;
  address?: IEntityAddress | null;
  metadata?: {};
}

export interface IIndividualCreateOpts extends IEntityCreateOpts {
  type: 'individual';
  individual: Partial<IEntityIndividual>;
}

export interface ICorporationCreateOpts extends IEntityCreateOpts {
  type:
  | 'c_corporation'
  | 's_corporation'
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship';
  corporation: Partial<IEntityCorporation>;
}

export interface IReceiveOnlyCreateOpts extends IEntityCreateOpts {
  type: 'receive_only';
  receive_only: IEntityReceiveOnly;
}

export interface IEntityUpdateOpts {
  address?: IEntityAddress;
  corporation?: Partial<IEntityCorporation>;
  individual?: Partial<IEntityIndividual>;
}

export interface IEntityListOpts {
  to_date?: string | null;
  from_date?: string | null;
  page?: number | string | null;
  page_limit?: number | string | null;
  page_cursor?: string | null;
  status?: string | null;
  type?: string | null;
}

export interface IEntityAnswer {
  id: string,
  text: string
}

export interface IEntityQuestion {
  id: string,
  text: string | null,
  answers: IEntityAnswer[]
}

export interface IEntityQuestionResponse {
  questions: IEntityQuestion[]
  authenticated: boolean,
}

export interface IAnswerOpts {
  question_id: string,
  answer_id: string
}

export interface IEntityUpdateAuthOpts {
  answers: IAnswerOpts[]
}

export interface IEntityUpdateAuthResponse {
  questions: IEntityQuestion[],
  authenticated: boolean,
}

export interface IEntityGetCreditScoreResponse {
  score: number,
  updated_at: string,
}

export interface IEntityWithdrawConsentOpts {
  type: 'withdraw',
  reason: 'entity_withdrew_consent' | null,
}

export class EntitySubResources {
  syncs: EntitySync;

  constructor(id: string, config: Configuration) {
    this.syncs = new EntitySync(config.addPath(id));
  }
}

export default class Entity extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('entities'));
  }

  protected _call(id): EntitySubResources {
    return new EntitySubResources(id, this.config);
  }

  async create(
    opts: IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts,
    requestConfig?: IRequestConfig,
  ) {
    return super._create<IEntity, IIndividualCreateOpts | ICorporationCreateOpts | IReceiveOnlyCreateOpts>(
      opts,
      requestConfig,
    );
  }

  async update(id: string, opts: IEntityUpdateOpts) {
    return super._updateWithId<IEntity, IEntityUpdateOpts>(id, opts);
  }

  async get(id: string) {
    return super._getWithId<IEntity>(id);
  }

  async list(opts?: IEntityListOpts) {
    return super._list<IEntity>(opts);
  }

  async createAuthSession(id: string) {
    return super._createWithSubPath<IEntityQuestionResponse, {}>(`/${id}/auth_session`, {});
  }

  async updateAuthSession(id: string, opts: IEntityUpdateAuthOpts) {
    return super._updateWithSubPath<IEntityUpdateAuthResponse, IEntityUpdateAuthOpts>(`/${id}/auth_session`, opts)
  }

  async refreshCapabilities(id: string) {
    return super._createWithSubPath<IEntity, {}>(`/${id}/refresh_capabilities`, {});
  }

  async getCreditScore(id: string) {
    return super._getWithSubPath<IEntityGetCreditScoreResponse>(`/${id}/credit_score`);
  }

  async withdrawConsent(id: string, data: IEntityWithdrawConsentOpts = { type: 'withdraw', reason: 'entity_withdrew_consent' }) {
    return super._createWithSubPath<IEntity, IEntityWithdrawConsentOpts>(
      `/${id}/consent`,
      data,
    );
  }
};
