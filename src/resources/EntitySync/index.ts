import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const EntitySyncTypes = {
  capabilities: 'capabilities',
  accounts: 'accounts',
}

export type TEntitySyncTypes =
    | 'capabilities'
    | 'accounts';

export interface IEntitySync {
  id: string;
  acc_id: string;
  status: string;
  type: TEntitySyncTypes;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export interface IEntitySyncCreateOpts {
  type: TEntitySyncTypes,
}

export default class EntitySync extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('syncs'));
  }

  async get(id: string) {
    return super._getWithId<IEntitySync>(id);
  }

  async create(data: IEntitySyncCreateOpts) {
    return super._create<IEntitySync, IEntitySyncCreateOpts>(data);
  }
}
