import Resource from '../../resource';
import Configuration from '../../configuration';
import { TAccountTypes } from './types';

export interface IAccountDetails {
  id: string;
  type: TAccountTypes;
  aggregator: string | null;
  name: string;
  institution_name: string;
  institution_logo: string;
  mask: string;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
};

export default class AccountDetails extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('details'));
  }

  /**
   * Retrieves account details
   * 
   * @returns IAccountDetails
   */

    async retrieve() {
      return super._get<IAccountDetails>();
    }
};