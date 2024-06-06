import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccountCardBrand } from './types';

export default class AccountCardBrand extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_brands'));
  }

  /**
   * Retrieves a Card Brand object.
   * 
   * @param cbrd_id ID of the Card
   * @returns Returns a Card object.
   */

  async retrieve(cbrd_id: string) {
    return super._getWithId<IAccountCardBrand>(cbrd_id);
  }
  
  /**
   * Creates a new CardBrand request to retrieve the Account’s card brand.
   * 
   * @returns Returns a Card object.
   */

  async create() {
    return super._create<IAccountCardBrand, {}>({});
  }
};
