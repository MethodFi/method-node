import Resource from '../../resource';
import Configuration from '../../configuration';

export const AccountTypes = {
   ach: 'ach',
   liability: 'liability',
}

export type TAccountTypes =
  | 'ach'
  | 'liability';

export const AccountSubTypes = {
   savings: 'savings',
   checking: 'checking',
}

export type TAccountSubTypes =
  | 'savings'
  | 'checking';

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAccountSubTypes;
}

export type IAccountLiability = {
  mch_id: string;
  mask: string;
};

export interface IAccount {
  id: string;
  holder_id: string;
  type: TAccountTypes;
  ach: IAccountACH | null;
  liability: IAccountLiability | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
}

export interface IAccountCreateOpts {
  holder_id: string;
  metadata?: {};
}

export interface IACHCreateOpts extends IAccountCreateOpts {
  ach: IAccountACH
}

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string,
    account_number: string,
  }
}

export default class Account extends Resource {
  constructor(config: Configuration) {
    super('/accounts', config);
  }

  async get(id: string) {
    return super._getWithId<IAccount>(id);
  }

  async list() {
    return super._list<IAccount>();
  }

  async create(data: IACHCreateOpts | ILiabilityCreateOpts) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts>(data);
  }
}
