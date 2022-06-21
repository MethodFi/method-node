import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export interface IAccountSync {
  id: string;
  acc_id: string;
  status: string;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export interface IAccountSyncCreateOpts {
}

export default class AccountSync extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('syncs'));
  }

  async get(id: string) {
    return super._getWithId<IAccountSync>(id);
  }

  async create(data: IAccountSyncCreateOpts) {
    return super._create<IAccountSync, IAccountSyncCreateOpts>(data);
  }
}
