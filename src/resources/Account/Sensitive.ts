import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const AccountSensitiveFields = {
  number: 'credit_card.number',
  billing_zip_code: 'credit_card.billing_zip_code',
  exp_month: 'credit_card.exp_month',
  exp_year: 'credit_card.exp_year',
  cvv: 'credit_card.cvv',
} as const;

export type TAccountSensitiveFields = typeof AccountSensitiveFields[keyof typeof AccountSensitiveFields];

export interface IAccountSensitiveCreditCard {
  number: string | null;
  billing_zip_code: string | null;
  exp_month: string | null;
  exp_year: string | null;
  cvv: string | null;
};

export interface IAccountSensitive {
  id: string;
  account_id: string;
  credit_card: IAccountSensitiveCreditCard;
  status: 'completed' | 'failed';
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export interface IAccountSensitiveCreateOpts {
  expand: TAccountSensitiveFields[];
};

export default class AccountSensitive extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('sensitive'));
  }

  /**
   * Creates an AccountSensitive request for an account.
   * 
   * @param data Sensitive fields to expand in the response. expand = ['number', 'billing_zip_code', 'exp_month', 'exp_year', 'cvv'];
   * @returns An AccountSensitive object
   */

  async create(data: IAccountSensitiveCreateOpts) {
    return super._create<IAccountSensitive, IAccountSensitiveCreateOpts>(data);
  }


  /**
   * Retrieve an AccountSensitive object by its ID.
   * 
   * @param astv ID of the AccountSensitive object
   * @returns An AccountSensitive object
   */

  async retrieve(astv: string) {
    return super._getWithId<IAccountSensitive>(astv);
  }
};
