import Resource from '../../resource';
import Configuration from '../../configuration';
import SimulatePayments from './Payments';
import SimulateAccounts from './Accounts';

export default class Simulate extends Resource{
  payments: SimulatePayments;
  accounts: SimulateAccounts;

  constructor(config: Configuration) {
    super(config.addPath('simulate'));
    this.payments = new SimulatePayments(config);
    this.accounts = new SimulateAccounts(config);
  }
};
