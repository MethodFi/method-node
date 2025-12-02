import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { IAccountCardBrand } from '../../Account';

export interface ISimulateAccountCardBrandCreateOpts {
  brand_id: string;
}

export default class SimulateCardBrands extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_brands'));
  }

  /**
   * Simulates a Card Brand for a Credit Card Account.
   * https://docs.methodfi.com/reference/simulations/card-brands/create
   *
   * @param opts ISimulateAccountCardBrandCreateOpts
   * @returns Returns the Card Brand object.
   */

  async create(opts: ISimulateAccountCardBrandCreateOpts) {
    return super._create<IResponse<IAccountCardBrand>, ISimulateAccountCardBrandCreateOpts>(opts);
  }
};

