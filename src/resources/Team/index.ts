import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';

export const TeamStatuses = {
  active: 'active',
  verified: 'verified',
  disabled: 'disabled',
  pending_disablement: 'pending_disablement',
} as const;

export type TTeamStatuses = keyof typeof TeamStatuses;

export interface ITeamProduct {
  type: string;
  enabled: boolean;
};

export interface ITeamKey {
  id: string;
  type: 'secret' | 'public';
  deleted: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
};

export interface ITeam {
  id: string;
  parent_id: string | null;
  name: string;
  legal_name: string;
  logo: string | null;
  api_version: string;
  status: TTeamStatuses;
  products: ITeamProduct[];
  keys: ITeamKey[];
  created_at: string;
  updated_at: string;
};

export interface ITeamCreateOpts {
  name: string;
};

export interface ITeamEncryptionKeyOpts {
  key: string;
};

export interface IMLEPublicKey {
  id: string;
  jwk: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export interface IMLEPublicKeyCreateOpts {
  jwk: Record<string, any>;
};

export class TeamPublicKeys extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('mle/public_keys'));
  }

  async list() {
    return super._list<IResponse<IMLEPublicKey>>();
  }

  async retrieve(key_id: string) {
    return super._getWithId<IResponse<IMLEPublicKey>>(key_id);
  }

  async create(opts: IMLEPublicKeyCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IMLEPublicKey>, IMLEPublicKeyCreateOpts>(opts, undefined, requestConfig);
  }

  async delete(key_id: string) {
    return super._delete<IResponse<IMLEPublicKey>>(key_id);
  }
};

export default class Team extends Resource {
  publicKeys: TeamPublicKeys;

  constructor(config: Configuration) {
    super(config.addPath('teams'));
    this.publicKeys = new TeamPublicKeys(this.config);
  }

  async retrieve() {
    return super._get<IResponse<ITeam>>();
  }

  async create(opts: ITeamCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<ITeam>, ITeamCreateOpts>(opts, undefined, requestConfig);
  }

  async updateEncryptionKey(opts: ITeamEncryptionKeyOpts, requestConfig?: IRequestConfig) {
    return super._createWithSubPath<IResponse<ITeam>, ITeamEncryptionKeyOpts>('/default_encryption_key', opts, requestConfig);
  }
};
