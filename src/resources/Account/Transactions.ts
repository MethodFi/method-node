import Resource, { IResourceError, IResourceListOpts } from '../../resource';
import Configuration from '../../configuration';

export const AccountCurrencyTypes = {
  USD: 'USD',
};

export type TAccountCurrencyTypes = keyof typeof AccountCurrencyTypes;

export const AccountTransactionStatuses = {
  cleared: 'cleared',
  auth: 'auth',
  refund: 'refund',
  unknown: 'unknown',
};

export type TAccountTransactionStatuses = keyof typeof AccountTransactionStatuses;

export interface IAccountTransactionMerchant {
  name: string;
  category_code: string;
  city: string;
  state: string;
  country: string;
  acquirer_bin: string;
  acquirer_card_acceptor_id: string;
};

export interface IAccountTransactionNetworkData {
  visa_merchant_id: string | null;
  visa_merchant_name: string | null;
  visa_store_id: string | null;
  visa_store_name: string | null;
};

export interface IAccountTransaction {
  id: string;
  account_id: string;
  merchant: IAccountTransactionMerchant;
  network: string;
  network_data: IAccountTransactionNetworkData | null;
  amount: number;
  currency: TAccountCurrencyTypes;
  billing_amount: number;
  billing_currency: TAccountCurrencyTypes;
  status: TAccountTransactionStatuses;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class AccountTransactions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('transactions'));
  }

  /**
   * Retrieve a Transaction object for an Account.
   * 
   * @param txn_id ID of the transaction
   * @returns Returns a Transaction object.
   */

  async retrieve(txn_id: string) {
    return super._getWithId<IAccountTransaction>(txn_id);
  }

  /**
   * Retrieve a list of Transactions objects for a specific Account.
   * 
   * @returns Returns a list of transactions for the account.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IAccountTransaction, IResourceListOpts>(opts);
  }
};
