import Resource from '../../resource';
import Configuration from '../../configuration';
import { IPayment, TPaymentStatuses } from '../Payment';


export interface ISimulatePaymentUpdateOpts {
  status: TPaymentStatuses;
  error_code?: number | null;
}

export default class SimulatePayment extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
  }

  async update(id: string, data: ISimulatePaymentUpdateOpts) {
    return super._postWithId<IPayment, ISimulatePaymentUpdateOpts>(id, data);
  }
}
