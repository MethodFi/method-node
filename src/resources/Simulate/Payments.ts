import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import { IPayment, TPaymentStatuses } from '../Payment';
import SimulatePaymentInstruments from './PaymentInstruments';

export interface ISimulatePaymentsUpdateOpts {
  status: TPaymentStatuses;
  error_code?: number | null;
};

export default class SimulatePayments extends Resource {
  paymentInstruments: SimulatePaymentInstruments;

  constructor(config: Configuration) {
    super(config.addPath('payments'));
    this.paymentInstruments = new SimulatePaymentInstruments(this.config);
  }

  /**
   * Updates a Payment’s status.
   * https://docs.methodfi.com/reference/simulations/payments/update
   *
   * @param id ID of the Payment
   * @param data The desired payment status or error code.
   * @returns A Payment with the updated status.
   */

  async update(id: string, data: ISimulatePaymentsUpdateOpts) {
    return super._postWithId<IResponse<IPayment>, ISimulatePaymentsUpdateOpts>(id, data);
  }
};
