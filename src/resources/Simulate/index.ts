import Resource from '../../resource';
import Configuration from '../../configuration';
import SimulatePayments from './Payments';
import SimulateTransactions from './Transactions';

export class SumulateSubResources {
  payments: SimulatePayments;
  transactions: SimulateTransactions;

  constructor(config: Configuration) {
    this.payments = new SimulatePayments(config);
    this.transactions = new SimulateTransactions(config);
  }
};

export interface Simulate {
  (): SumulateSubResources;
};

export class Simulate extends Resource {
  payments: SimulatePayments;
  transactions: SimulateTransactions;

  constructor(config: Configuration) {
    super(config.addPath('simulate'));
  }

  protected _call(): SumulateSubResources {
    return new SumulateSubResources(this.config);
  }
};

export default Simulate;
