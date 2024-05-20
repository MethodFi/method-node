import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const AccountSensitiveFields = {
  auto_loan_number: 'auto_loan.number',
  mortgage_number: 'mortgage.number',
  personal_loan_number: 'personal_loan.number',
  credit_card_number: 'credit_card.number',
  credit_card_billing_zip_code: 'credit_card.billing_zip_code',
  credit_card_exp_month: 'credit_card.exp_month',
  credit_card_exp_year: 'credit_card.exp_year',
  credit_card_cvv: 'credit_card.cvv',
} as const;

export type TAccountSensitiveFields = typeof AccountSensitiveFields[keyof typeof AccountSensitiveFields];

export interface IAccountSensitiveLoan {
  number: string;
};

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
  auto_loan?: IAccountSensitiveLoan;
  credit_card?: IAccountSensitiveCreditCard;
  mortgage?: IAccountSensitiveLoan;
  personal_loan?: IAccountSensitiveLoan;
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
   * Retrieve a Sensitive record for an Account.
   * 
   * @param astv_id ID of the Sensitive object
   * @returns A Sensitive object
   */

  async retrieve(astv_id: string) {
    return super._getWithId<IAccountSensitive>(astv_id);
  }

  /**
   * Creates a new Sensitive request to retrieve sensitive Account information.
   * 
   * @param data Sensitive fields to expand in the response.
   * @returns A Sensitive object
   */

  async create(data: IAccountSensitiveCreateOpts) {
    return super._create<IAccountSensitive, IAccountSensitiveCreateOpts>(data);
  }
};
