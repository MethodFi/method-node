import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const AccountSensitiveFields = {
  number: 'number',
  billing_zip_code: 'billing_zip_code',
  exp_month: 'exp_month',
  exp_year: 'exp_year',
  cvv: 'cvv',
};

export type TAccountSensitiveFields = keyof typeof AccountSensitiveFields;

export interface IAccountSensitive {
  id: string;
  account_id: string;
  number?: string;
  exp_month?: string;
  exp_year?: string;
  cvv?: string;
  billing_zip_code?: string;
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
