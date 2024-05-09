import Resource, { IRequestConfig, IResourceListOpts } from '../../resource';
import Configuration from '../../configuration';
import AccountCards from './Cards';
import AccountPayoffs from './Payoffs';
import AccountUpdates from './Updates';
import AccountBalances from './Balances';
import AccountSensitive from './Sensitive';
import AccountTransactions from './Transactions';
import AccountSubscriptions from './Subscriptions';
import AccountVerificationSession from './VerificationSessions';
import type {
  IAccount,
  IAccountACH,
  TAccountExpandableFields,
} from './types';

export const AccountClearingSubTypes = {
  single_use: 'single_use',
}

export type TAccountClearingSubTypes = keyof typeof AccountClearingSubTypes;

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

export interface IAccountListOpts extends IResourceListOpts {
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
  balances: AccountBalances;
  cards: AccountCards;
  payoffs: AccountPayoffs;
  sensitive: AccountSensitive;
  subscriptions: AccountSubscriptions;
  transactions: AccountTransactions;
  updates: AccountUpdates;
  verificationSessions: AccountVerificationSession;

  constructor(acc_id: string, config: Configuration) {
    this.balances = new AccountBalances(config.addPath(acc_id));
    this.cards = new AccountCards(config.addPath(acc_id));
    this.payoffs = new AccountPayoffs(config.addPath(acc_id));
    this.sensitive = new AccountSensitive(config.addPath(acc_id));
    this.subscriptions = new AccountSubscriptions(config.addPath(acc_id));
    this.transactions = new AccountTransactions(config.addPath(acc_id));
    this.updates = new AccountUpdates(config.addPath(acc_id));
    this.verificationSessions = new AccountVerificationSession(config.addPath(acc_id));
  }
};

export interface Account {
  (acc_id: string): AccountSubResources;
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

  async retrieve<K extends TAccountExpandableFields = never>(acc_id: string, opts?: { expand: K[] }) {
    return super._getWithSubPathAndParams<{[P in keyof IAccount]: P extends K ? Exclude<IAccount[P], string> : Extract<IAccount[P], string | null>}, { expand: K[]; } | undefined>(acc_id, opts);
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

  async create(data: IACHCreateOpts | ILiabilityCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts>(data, requestConfig);
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
