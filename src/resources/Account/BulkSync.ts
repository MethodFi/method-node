import Resource from '../../resource';
import Configuration from '../../configuration';
import { IAccountSync } from './Syncs';

export interface IAccountCreateBulkSyncOpts {
  acc_ids: string[];
};

export interface IAccountCreateBulkSyncResponse {
  success: string[];
  failed: string[];
  results: IAccountSync[];
};

export default class AccountBulkSync extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('bulk_sync'));
  }

  /**
   * Creates a bulk sync request for accounts provided
   * 
   * @param acc_ids array of acc_ids
   * @returns IAccountCreateBulkSyncResponse
   */

  async create(acc_ids: string[]) {
    return super._create<IAccountCreateBulkSyncResponse, IAccountCreateBulkSyncOpts>({
      acc_ids
    });
  }
};