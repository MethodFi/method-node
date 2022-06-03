import Resource from '../../resource';
import Configuration from '../../configuration';
import SimulatePayment from '../SimulatePayment';


export default class Simulate extends Resource {
  payments: SimulatePayment;

  constructor(config: Configuration) {
    const _config = config.addPath('simulate');
    super(_config);

    this.payments = new SimulatePayment(_config);
  }
}
