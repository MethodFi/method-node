import Resource from '../../../resource';
import Configuration from '../../../configuration';
import SimulateTransactions from './Transactions';
import SimulateCardBrands from './CardBrands';

export class SimulateAccountsSubResources {
  transactions: SimulateTransactions;
  cardBrands: SimulateCardBrands;
  constructor(acc_id: string, config: Configuration) {
    this.transactions = new SimulateTransactions(config.addPath(acc_id));
    this.cardBrands = new SimulateCardBrands(config.addPath(acc_id));
  }
};

export interface SimulateAccounts {
  (acc_id: string): SimulateAccountsSubResources;
};


export class SimulateAccounts extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('accounts'));
  }

  protected _call(acc_id: string): SimulateAccountsSubResources {
    return new SimulateAccountsSubResources(acc_id, this.config);
  }
};

export default SimulateAccounts;
export * from './CardBrands';
