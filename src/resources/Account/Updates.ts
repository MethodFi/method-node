import Resource, { IResourceListOpts } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IAccountUpdate } from './types';

export default class AccountUpdates extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('updates'));
  }

  /**
   * Retrieve an Update object by its ID.
   * 
   * @param upt_id ID of the Update
   * @returns Returns an Update object.
   */

  async retrieve(upt_id: string) {
    return super._getWithId<IResponse<IAccountUpdate>>(upt_id);
  }

  /**
   * Retrieve a list of Updates for a specific Account.
   * 
   * @returns Returns a list of Updates.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountUpdate>, IResourceListOpts>(opts);
  }

  /**
   * Creates a new Update for a liability Account.
   * 
   * @returns Returns an Update object.
   */

  async create() {
    return super._create<IResponse<IAccountUpdate>, {}>({});
  }
};

