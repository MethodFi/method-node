import Resource, { IRequestConfig, IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';

export const SecretStatuses = {
  active: 'active',
  deleted: 'deleted',
} as const;

export type TSecretStatuses = keyof typeof SecretStatuses;

export interface ISecret {
  id: string;
  metadata: {} | null;
  status: TSecretStatuses;
  created_at: string;
  updated_at: string;
};

export interface ISecretCreateOpts {
  value: string;
  metadata?: {};
};

export default class Secret extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('secrets'));
  }

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<ISecret>>(opts);
  }

  async retrieve(sec_id: string) {
    return super._getWithId<IResponse<ISecret>>(sec_id);
  }

  async create(opts: ISecretCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<ISecret>, ISecretCreateOpts>(opts, undefined, requestConfig);
  }

  async delete(sec_id: string) {
    return super._delete<IResponse<null>>(sec_id);
  }
};
