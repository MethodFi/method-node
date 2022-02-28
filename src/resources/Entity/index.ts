import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';

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
};

export type TEntityCapabilities =
  | 'payments:send'
  | 'payments:receive'
  | 'payments:limited-send';

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
  status?: string | null;
  type?: string | null;
}


export default class Entity extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('entities'));
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
};
