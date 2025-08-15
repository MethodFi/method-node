import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountAttributes } from './types';

export default class AccountAttributes extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('attributes'));
  }

  /**
   * Retrieves an Attributes record for an Account.
   * https://docs.methodfi.com/reference/accounts/attributes/retrieve
   *
   * @param acc_attr_id ID of the Attribute
   * @returns Returns an Account’s Attribute object.
   */

  async retrieve(acc_attr_id: string) {
    return super._getWithId<IResponse<IAccountAttributes>>(acc_attr_id);
  }

  /**
   * Retrieves a list of Attributes objects for an account.
   * https://docs.methodfi.com/reference/accounts/attributes/list
   *
   * @returns Returns a list of Attributes objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountAttributes>>(opts);
  }

  /**
   * Creates a new Attributes request to retrieve the Account’s attributes.
   * https://docs.methodfi.com/reference/accounts/attributes/create
   *
   * @returns Returns an Account’s Attributes object.
   */

  async create() {
    return super._create<IResponse<IAccountAttributes>, {}>({});
  }
};
