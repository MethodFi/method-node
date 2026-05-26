import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';
import type { IAccountCardBrand } from '../../Account';

export default class SimulateCardBrands extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_brands'));
  }

  async create() {
    return super._create<IResponse<IAccountCardBrand>, {}>({});
  }
};
