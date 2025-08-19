import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountCardBrand } from './types';

export default class AccountCardBrand extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_brands'));
  }

  /**
   * Retrieves a Card Brand object.
   * https://docs.methodfi.com/reference/accounts/card-brands/retrieve
   *
   * @param cbrd_id ID of the Card
   * @returns Returns a Card object.
   */

  async retrieve(cbrd_id: string) {
    return super._getWithId<IResponse<IAccountCardBrand>>(cbrd_id);
  }

  /**
   * Retrieves a list of CardBrand objects for an account.
   * https://docs.methodfi.com/reference/accounts/card-brands/list
   *
   * @returns Returns a list of CardBrand objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountCardBrand>>(opts);
  }

  /**
   * Creates a new CardBrand request to retrieve the Account’s card brand.
   * https://docs.methodfi.com/reference/accounts/card-brands/create
   *
   * @returns Returns a Card object.
   */

  async create() {
    return super._create<IResponse<IAccountCardBrand>, {}>({});
  }
};
