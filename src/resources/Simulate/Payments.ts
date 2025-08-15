import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import { IPayment, TPaymentStatuses } from '../Payment';

export interface ISimulatePaymentsUpdateOpts {
  status: TPaymentStatuses;
  error_code?: number | null;
};

export default class SimulatePayments extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
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
