import Resource from '../../resource';
import Configuration from '../../configuration';

export const BINBrands = {
  amex: 'amex',
  visa: 'visa',
  mastercard: 'mastercard',
  discover: 'discover',
  diners_club: 'diners_club',
};

export type TBINBrands =
  | 'amex'
  | 'visa'
  | 'mastercard'
  | 'discover'
  | 'diners_club';

export const BINTypes = {
   credit: 'credit',
   debit: 'debit',
}

export type TBINTypes =
  | 'credit'
  | 'debit';

export interface IBIN {
  id: string | null;
  bin: string | null,
  brand: TBINBrands,
  issuer: string | null,
  type: TBINTypes | null,
  category: string | null,
  bank_url: string | null,
  sample_pan: string | null,
}

export default class Bin extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('bins'));
  }

  /**
   * Retrieves bin information
   * 
   * @param bin { bin: string }
   * @returns IBIN
   */

  async retrieve(bin: string) {
    return super._getWithParams<IBIN, { bin: string }>({ bin });
  }
}
