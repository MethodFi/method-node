import Resource from '../../resource';
import Configuration from '../../configuration';

export interface IAccountSensitive {
  number: string | null;
  encrypted_number: string | null;
  bin_4: string | null;
  bin_6: string | null;
  payment_address: any | null;
};

export default class AccountSensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sensitive'));
  }

  /**
   * Retrieves sensitive fields for an account
   * 
   * @param fields 'number' | 'encrypted_number' | 'bin_4' | 'bin_6' | 'payment_address' | 'encrypted_tabapay_card' | 'billing_zip_code' | 'expiration_month' | 'expiration_year';  
   * @returns IAccountSensitive
   */

  async retrieve(fields: string[]) {
    return super._getWithParams<IAccountSensitive, { fields: string[] }>({ fields });
  }
};
