import Resource from '../../resource';
import Configuration from '../../configuration';

export const MerchantTypes = {
   auto_loan: 'auto_loan',
   business_loan: 'business_loan',
   credit_card: 'credit_card',
   electric_utility: 'electric_utility',
   home_loan: 'home_loan',
   insurance: 'insurance',
   internet_utility: 'internet_utility',
   loan: 'loan',
   medical: 'medical',
   personal_loan: 'personal_loan',
   student_loan: 'student_loan',
   telephone_utility: 'telephone_utility',
   television_utility: 'television_utility',
   water_utility: 'water_utility',
   bank: 'bank',
   home_equity_loan: 'home_equity_loan',
   mortgage: 'mortgage',
   utility: 'utility',
   waste_utility: 'waste_utility',
};

export type TMerchantTypes =
  | 'auto_loan'
  | 'business_loan'
  | 'credit_card'
  | 'electric_utility'
  | 'home_loan'
  | 'insurance'
  | 'internet_utility'
  | 'loan'
  | 'medical'
  | 'personal_loan'
  | 'student_loan'
  | 'telephone_utility'
  | 'television_utility'
  | 'water_utility'
  | 'bank'
  | 'home_equity_loan'
  | 'mortgage'
  | 'utility'
  | 'waste_utility';

export interface IMerchantProviderIds {
  plaid: string[];
  mx: string[];
  finicity: string[];
}

export interface IMerchant {
  mch_id: string;
  parent_name: string;
  name: string;
  logo: string;
  description: string | null;
  note: string | null;
  types: TMerchantTypes[];
  account_prefixes: string[];
  provider_ids: IMerchantProviderIds;
}

export interface IMerchantListOpts {
  name?: string,
  'provider_id.plaid'?: string,
  'provider_id.mx'?: string,
  'provider_id.finicity'?: string,
}

export default class Merchant extends Resource {
  constructor(config: Configuration) {
    super('/merchants', config);
  }

  async get(id: string) {
    return super._getWithId<IMerchant>(id);
  }

  async list(opts: IMerchantListOpts) {
    return super._list<IMerchant, IMerchantListOpts>(opts);
  }
};
