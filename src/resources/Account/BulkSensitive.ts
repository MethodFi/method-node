import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccountSensitive } from './Sensitive';
import type { TAccountLiabilityTypes } from './types';

export interface IAccountBulkSensitiveResults extends IAccountSensitive {
  id: string;
  type: TAccountLiabilityTypes;
};

export interface IAccountCreateBulkSensitiveResponse {
  success: string[];
  failed: string[];
  results: IAccountBulkSensitiveResults[];
};

export default class AccountBulkSensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('bulk_sensitive'));
  }

  /**
   * Retrieves sensitive fields for multiple accounts
   * 
   * @param acc_ids array of acc_ids
   * @param fields 'number' | 'encrypted_number' | 'bin_4' | 'bin_6' | 'payment_address' | 'encrypted_tabapay_card' | 'billing_zip_code' | 'expiration_month' | 'expiration_year';
   * @returns IAccountCreateBulkSensitiveResponse
   */

  async create(acc_ids: string[], fields: string[]) {
    return super._create<IAccountCreateBulkSensitiveResponse, { acc_ids: string[], fields: string[] }>({
      acc_ids,
      fields
    });
  }
};