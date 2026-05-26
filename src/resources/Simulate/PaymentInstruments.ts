import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IPayment } from '../Payment';

export interface ISimulatePaymentViaInstrumentOpts {
  amount: number;
};

export class SimulatePaymentInstrumentInstance extends Resource {
  constructor(pmt_inst_id: string, config: Configuration) {
    super(config.addPath(pmt_inst_id));
  }

  async create(opts: ISimulatePaymentViaInstrumentOpts) {
    return super._create<IResponse<IPayment>, ISimulatePaymentViaInstrumentOpts>(opts);
  }
};

export interface SimulatePaymentInstruments {
  (pmt_inst_id: string): SimulatePaymentInstrumentInstance;
};

export class SimulatePaymentInstruments extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payment_instruments'));
  }

  protected _call(pmt_inst_id: string): SimulatePaymentInstrumentInstance {
    return new SimulatePaymentInstrumentInstance(pmt_inst_id, this.config);
  }
};

export default SimulatePaymentInstruments;
