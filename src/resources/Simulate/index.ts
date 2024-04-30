import Resource from '../../resource';
import Configuration from '../../configuration';
import SimulatePayments from './Payments';
import SimulateAccounts from './Accounts';

export interface Simulate {
  payments: SimulatePayments;
  accounts: SimulateAccounts;
};

export class Simulate extends Resource {
  payments: SimulatePayments;
  accounts: SimulateAccounts;

  constructor(config: Configuration) {
    const _config = config.addPath('simulate');
    super(_config);
    this.payments = new SimulatePayments(_config);
    this.accounts = new SimulateAccounts(_config);
  }
};

export default Simulate;