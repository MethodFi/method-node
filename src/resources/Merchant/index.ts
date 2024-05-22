import Resource from '../../resource';
import Configuration from '../../configuration';

export const MerchantTypes = {
  auto_loan: 'auto_loan',
  credit_card: 'credit_card',
  collection: 'collection',
  personal_loan: 'personal_loan',
  student_loan: 'student_loan',
  mortgage: 'mortgage',
};

export type TMerchantTypes = keyof typeof MerchantTypes;

export interface IMerchantProviderIds {
  plaid: string[];
  mx: string[];
  finicity: string[];
  dpp: string[];
};

export interface IMerchant {
  id: string;
  parent_name: string;
  name: string;
  logo: string;
  type: TMerchantTypes;
  provider_ids: IMerchantProviderIds;
  is_temp: boolean;
  account_number_formats: string[];
};

export interface IMerchantListOpts {
  page?: number | string | null;
  page_limit?: number | string | null;
  type?: TMerchantTypes | null;
  name?: string;
  creditor_name?: string;
  'provider_id.plaid'?: string;
  'provider_id.mx'?: string;
  'provider_id.finicity'?: string;
  'provider_id.dpp'?: string;
};

export default class Merchant extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('merchants'));
  }

  /**
   * Retrieves a merchant by id
   * 
   * @param mch_id Method merchant id
   * @returns IMerchant
   */

  async retrieve(mch_id: string) {
    return super._getWithId<IMerchant>(mch_id);
  }

  /**
   * Lists all merchants
   * 
   * @param opts IMerchantListOpts: https://docs.methodfi.com/api/core/merchants/list
   * @returns IMerchant[]
   */

  async list(opts?: IMerchantListOpts) {
    return super._list<IMerchant, IMerchantListOpts>(opts);
  }
};
