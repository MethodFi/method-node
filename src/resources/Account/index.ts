import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import AccountCardBrand from './CardBrands';
import AccountPayoffs from './Payoffs';
import AccountUpdates from './Updates';
import AccountBalances from './Balances';
import AccountSensitive from './Sensitive';
import AccountTransactions from './Transactions';
import AccountSubscriptions from './Subscriptions';
import AccountVerificationSession from './VerificationSessions';
import type {
  IAccount,
  IAccountListOpts,
  IACHCreateOpts,
  ILiabilityCreateOpts,
  IAccountWithdrawConsentOpts,
  TAccountExpandableFields,
} from './types';

export class AccountSubResources {
  balances: AccountBalances;
  cardBrands: AccountCardBrand;
  payoffs: AccountPayoffs;
  sensitive: AccountSensitive;
  subscriptions: AccountSubscriptions;
  transactions: AccountTransactions;
  updates: AccountUpdates;
  verificationSessions: AccountVerificationSession;

  constructor(acc_id: string, config: Configuration) {
    this.balances = new AccountBalances(config.addPath(acc_id));
    this.cardBrands = new AccountCardBrand(config.addPath(acc_id));
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
   * Returns the Account associated with the ID.
   *
   * @param acc_id id of the account
   * @returns Returns the Account associated with the ID.
   */

  async retrieve<K extends TAccountExpandableFields = never>(acc_id: string, opts?: { expand: K[] }) {
    return super._getWithSubPathAndParams<IResponse<{
      [P in keyof IAccount]: P extends K
        ? Exclude<IAccount[P], string>
        : IAccount[P]
      }>, { expand: K[]; } | undefined>(acc_id, opts);
  }

  /**
   * Returns a list of Accounts.
   *
   * @param opts IAccountListOpts: https://docs.methodfi.com/api/core/accounts/list
   * @returns Returns a list of Accounts.
   */

  async list<K extends TAccountExpandableFields = never>(opts?: IAccountListOpts<K>) {
    return super._list<IResponse<{
      [P in keyof IAccount]: P extends K
      ? Exclude<IAccount[P], string>
      : IAccount[P]
    }>, IAccountListOpts<K> | undefined>(opts);
  }

  /**
   * Creates a new Account for an Entity, either ach or liability, based on the parameters provided. An account is a unique representation of an ACH or Liability account.
   *
   * @param data Create options: https://docs.methodfi.com/api/core/accounts/create
   * @param requestConfig Allows for idempotency: { idempotency_key?: string }
   * @returns Returns an Account object.
   */

  async create(data: IACHCreateOpts | ILiabilityCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IAccount>, IACHCreateOpts | ILiabilityCreateOpts>(data, requestConfig);
  }


  /**
   * Withdraws an Account’s consent. This endpoint deletes information on the account, sets its status to disabled, and removes all active Products or Subscriptions for the account.
   *
   * @param acc_id id of the account
   * @param data IAccountWithdrawConsentOpts: { type: 'withdraw', reason: 'holder_withdrew_consent' | null }
   * @returns Returns the Account with status set to disabled.
   */

  async withdrawConsent(acc_id: string, data: IAccountWithdrawConsentOpts = { type: 'withdraw', reason: 'holder_withdrew_consent' }) {
    return super._createWithSubPath<IResponse<IAccount>, IAccountWithdrawConsentOpts>(
      `/${acc_id}/consent`,
      data,
    );
  }
};

export default Account;
export * from './types';
