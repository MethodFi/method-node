import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import type { IAccount, IAccountACH } from './types';
import AccountSync from './Syncs';
import AccountCards from './Cards';
import AccountDetails from './Details';
import AccountPayoffs from './Payoffs';
import AccountUpdates from './Updates';
import AccountBalances from './Balances';
import AccountBulkSync from './BulkSync';
import AccountSensitive from './Sensitive';
import AccountAutoSyncs from './AutoSyncs';
import AccountTransactions from './Transactions';
import AccountSubscriptions from './Subscriptions';
import AccountBulkSensitive from './BulkSensitive';
import AccountPaymentHistory from './PaymentHistory';
import AccountVerificationSession from './VerificationSessions';

export const AccountClearingSubTypes = {
  single_use: 'single_use',
}

export type TAccountClearingSubTypes =
  | 'single_use';

export interface IAccountCreateOpts {
  holder_id: string;
  metadata?: {};
};

export interface IACHCreateOpts extends IAccountCreateOpts {
  ach: IAccountACH;
};

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string;
    account_number?: string;
    number?: string;
  }
};

export type TLiabilityMortgageUpdateOpts = {
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
};

export type TLiabilityCreditCardUpdateOpts = {
  number: string;
} | {
  expiration_month: number;
  expiration_year: number;
};

export interface ILiabilityUpdateOpts {
  mortgage: TLiabilityMortgageUpdateOpts | null;
  credit_card: TLiabilityCreditCardUpdateOpts | null;
};

export interface IClearingCreateOpts extends IAccountCreateOpts {
  clearing: {
    type: TAccountClearingSubTypes;
  }
};

export interface IAccountListOpts {
  to_date?: string | null;
  from_date?: string | null;
  page?: number | string | null;
  page_limit?: number | string | null;
  page_cursor?: string | null;
  status?: string | null;
  type?: string | null;
  holder_id?: string | null;
  'liability.mch_id'?: string | null;
  'liability.type'?: string | null;
};

export interface IAccountWithdrawConsentOpts {
  type: 'withdraw';
  reason: 'holder_withdrew_consent' | null;
};

export class AccountSubResources {
  autoSyncs: AccountAutoSyncs;
  balances: AccountBalances;
  bulkSensitive: AccountBulkSensitive;
  bulkSync: AccountBulkSync;
  cards: AccountCards;
  details: AccountDetails;
  paymentHistory: AccountPaymentHistory;
  payoffs: AccountPayoffs;
  sensitive: AccountSensitive;
  subscriptions: AccountSubscriptions;
  syncs: AccountSync;
  transactions: AccountTransactions;
  updates: AccountUpdates;
  verificationSessions: AccountVerificationSession;

  constructor(acc_id: string, config: Configuration) {
    this.autoSyncs = new AccountAutoSyncs(config.addPath(acc_id));
    this.balances = new AccountBalances(config.addPath(acc_id));
    this.bulkSensitive = new AccountBulkSensitive(config.addPath(acc_id));
    this.bulkSync = new AccountBulkSync(config.addPath(acc_id));
    this.cards = new AccountCards(config.addPath(acc_id));
    this.details = new AccountDetails(config.addPath(acc_id));
    this.paymentHistory = new AccountPaymentHistory(config.addPath(acc_id));
    this.payoffs = new AccountPayoffs(config.addPath(acc_id));
    this.sensitive = new AccountSensitive(config.addPath(acc_id));
    this.subscriptions = new AccountSubscriptions(config.addPath(acc_id));
    this.syncs = new AccountSync(config.addPath(acc_id));
    this.transactions = new AccountTransactions(config.addPath(acc_id));
    this.updates = new AccountUpdates(config.addPath(acc_id));
    this.verificationSessions = new AccountVerificationSession(config.addPath(acc_id));
  }
};

export interface Account {
  (id: string): AccountSubResources;
};

export class Account extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('accounts'));
  }

  protected _call(acc_id: string): AccountSubResources {
    return new AccountSubResources(acc_id, this.config);
  }

  /**
   * Retrieves an account by acc_id
   * 
   * @param acc_id id of the account
   * @returns IAccount
   */

  async retrieve(acc_id: string) {
    return super._getWithId<IAccount>(acc_id);
  }

  /**
   * Updates an account by acc_id
   * 
   * @param acc_id id of the account
   * @param opts ILiabilityUpdateOpts
   * @returns IAccount
   */

  async update(acc_id: string, opts: ILiabilityUpdateOpts) {
    return super._updateWithId<IAccount, ILiabilityUpdateOpts>(acc_id, opts);
  }

  /**
   * Lists all accounts
   * 
   * @param opts IAccountListOpts: https://docs.methodfi.com/api/core/accounts/list
   * @returns IAccount[]
   */

  async list(opts?: IAccountListOpts) {
    return super._list<IAccount, IAccountListOpts>(opts);
  }

  /**
   * Creates a new account
   * 
   * @param data Create options: https://docs.methodfi.com/api/core/accounts/create
   * @param requestConfig Allows for idempotency: { idempotency_key?: string }
   * @returns IAccount
   */

  async create(data: IACHCreateOpts | ILiabilityCreateOpts | IClearingCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts | IClearingCreateOpts>(data, requestConfig);
  }


  /**
   * Withdraws consent for an account
   * 
   * @param acc_id id of the account
   * @param data IAccountWithdrawConsentOpts: { type: 'withdraw', reason: 'holder_withdrew_consent' | null }
   * @returns IAccount
   */
  
  async withdrawConsent(id: string, data: IAccountWithdrawConsentOpts = { type: 'withdraw', reason: 'holder_withdrew_consent' }) {
    return super._createWithSubPath<IAccount, IAccountWithdrawConsentOpts>(
      `/${id}/consent`,
      data,
    );
  }
};

export default Account;
