import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';

export interface IManagedAccount {
  id: string;
  type: string;
  status: string;
  routing_number: string | null;
  account_number: string | null;
  balance: number | null;
  created_at: string;
  updated_at: string;
};

export interface IManagedAccountTransaction {
  id: string;
  managed_account_id: string;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export class ManagedAccountTransactions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IManagedAccountTransaction>>(opts);
  }
};

export class ManagedAccountSubResources {
  transactions: ManagedAccountTransactions;
  constructor(macc_id: string, config: Configuration) {
    this.transactions = new ManagedAccountTransactions(config.addPath(macc_id));
  }
};

export interface ManagedAccount {
  (macc_id: string): ManagedAccountSubResources;
};

export class ManagedAccount extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('managed_accounts'));
  }

  protected _call(macc_id: string): ManagedAccountSubResources {
    return new ManagedAccountSubResources(macc_id, this.config);
  }

  async list() {
    return super._list<IResponse<IManagedAccount>>();
  }

  async retrieve(macc_id: string) {
    return super._getWithId<IResponse<IManagedAccount>>(macc_id);
  }
};
