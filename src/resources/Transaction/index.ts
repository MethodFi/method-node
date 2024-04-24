import Resource from '../../resource';
import Configuration from '../../configuration';

export interface ITransaction {
  id: string;
  acc_id: string;
  mcc: string;
  description: string;
  presentable_description: string;
  amount: string;
  currency: string;
  billing_amount: string;
  billing_currency: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export default class Transaction extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  async list() {
    return super._list<ITransaction>();
  }

  async retrieve(id: string) {
    return super._getWithId<ITransaction>(id);
  }
}
