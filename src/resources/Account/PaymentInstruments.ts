import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountPaymentInstrument, IPaymentInstrumentCreateOpts } from './types';

export default class AccountPaymentInstruments extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payment_instruments'));
  }

  /**
   * Retrieves a Payment Instrument record for an Account.
   *
   * @param pmt_inst_id ID of the Payment Instrument
   * @returns Returns an Account’s Payment Instrument object.
   */

  async retrieve(pmt_inst_id: string) {
    return super._getWithId<IResponse<IAccountPaymentInstrument>>(pmt_inst_id);
  }

  /**
   * Retrieves a list of Payment Instrument objects for an account.
   *
   * @returns Returns a list of Payment Instrument objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountPaymentInstrument>>(opts);
  }

  /**
   * Creates a new Payment Instrument request to retrieve the Account’s payment instruments.
   *
   * @returns Returns an Account’s Payment Instrument object.
   */

  async create(data: IPaymentInstrumentCreateOpts) {
    return super._create<IResponse<IAccountPaymentInstrument>, IPaymentInstrumentCreateOpts>(data);
  }
};
