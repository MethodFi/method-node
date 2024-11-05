import Resource from '../../resource';
import Configuration from '../../configuration';
import SimulatePayments from './Payments';
import SimulateAccounts from './Accounts';
import SimulateEvents from './Events';

export interface Simulate {
  payments: SimulatePayments;
  accounts: SimulateAccounts;
  events: SimulateEvents;
};

export class Simulate extends Resource {
  payments: SimulatePayments;
  accounts: SimulateAccounts;
  events: SimulateEvents;
  constructor(config: Configuration) {
    const _config = config.addPath('simulate');
    super(_config);
    this.payments = new SimulatePayments(_config);
    this.accounts = new SimulateAccounts(_config);
    this.events = new SimulateEvents(_config);
  }
};

export default Simulate;
