import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import Reversal from './Reversals';
import type {
  IPayment,
  IPaymentListOpts,
  IPaymentCreateOpts,
} from './types';

export class PaymentSubResources {
  reversals: Reversal;

  constructor(id: string, config: Configuration) {
    this.reversals = new Reversal(config.addPath(id));
  }
};

export interface Payment {
  (id: string): PaymentSubResources;
};

export class Payment extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payments'));
  }

  protected _call(pmt_id: string): PaymentSubResources {
    return new PaymentSubResources(pmt_id, this.config);
  }

  /**
   * Retrieves payment by id
   * https://docs.methodfi.com/reference/payments/retrieve
   *
   * @param pmt_id id of the payment
   * @returns IPayment
   */

  async retrieve(pmt_id: string) {
    return super._getWithId<IResponse<IPayment>>(pmt_id);
  }

  /**
   * Lists all payments
   * https://docs.methodfi.com/reference/payments/list
   *
   * @param opts IPaymentListOpts
   * @returns IPayment[]
   */

  async list(opts?: IPaymentListOpts) {
    return super._list<IResponse<IPayment>, IPaymentListOpts>(opts);
  }

  /**
   * Creates a payment
   * https://docs.methodfi.com/reference/payments/create
   *
   * @param opts IPaymentCreateOpts
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns IPayment
   */

  async create(opts: IPaymentCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IPayment>, IPaymentCreateOpts>(opts, requestConfig);
  }

  /**
   * Cancels a payment
   * https://docs.methodfi.com/reference/payments/delete
   *
   * @param pmt_id id of the payment
   * @returns IPayment
   */

  async delete(pmt_id: string) {
    return super._delete<IResponse<IPayment>>(pmt_id);
  }
};

export default Payment;
export * from './types';
