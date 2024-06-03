import Resource, { IRequestConfig, IResourceListOpts, IResourceError } from '../../resource';
import Configuration from '../../configuration';
import AccountCardBrand, { IAccountCardBrand } from './CardBrands';
import AccountPayoffs, { IAccountPayoff } from './Payoffs';
import AccountUpdates, { IAccountUpdate } from './Updates';
import AccountBalances, { IAccountBalance } from './Balances';
import AccountSensitive, { IAccountSensitive } from './Sensitive';
import AccountTransactions, { IAccountTransaction } from './Transactions';
import AccountSubscriptions from './Subscriptions';
import AccountVerificationSession, { IAccountVerificationSession } from './VerificationSessions';
import type {
  IAccountACH,
  IAccountLiability,
  TAccountExpandableFields,
  TAccountProducts,
  TAccountStatuses,
  TAccountSubscriptionTypes,
  TAccountTypes,
} from './types';

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

export interface IAccountListOpts<T extends TAccountExpandableFields> extends IResourceListOpts {
  status?: string | null;
  type?: string | null;
  holder_id?: string | null;
  expand?: T[];
  'liability.mch_id'?: string | null;
  'liability.type'?: TAccountLiabilityTypes | null;
  'liability.ownership'?: TAccountOwnership | null;
};

export interface IAccountWithdrawConsentOpts {
  type: 'withdraw';
  reason: 'holder_withdrew_consent' | null;
};

export interface IAccount {
  id: string;
  holder_id: string;
  status: TAccountStatuses;
  type: TAccountTypes | null;
  ach?: IAccountACH | null;
  liability?: IAccountLiability | null;
  clearing?: null;
  products: TAccountProducts[];
  restricted_products: TAccountProducts[];
  subscriptions?: TAccountSubscriptionTypes[];
  available_subscriptions?: TAccountSubscriptionTypes[];
  restricted_subscriptions?: TAccountSubscriptionTypes[];
  sensitive?: string | IAccountSensitive | null;
  balance?: string | IAccountBalance | null;
  card_brand?: string | IAccountCardBrand | null;
  payoff?: string | IAccountPayoff | null;
  transactions?: string | IAccountTransaction[] | null;
  update?: string | IAccountUpdate | null;
  latest_verification_session?: string | IAccountVerificationSession | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
};

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
    return super._getWithSubPathAndParams<{
      [P in keyof IAccount]: P extends K
        ? Exclude<IAccount[P], string>
        : Extract<IAccount[P], string | null>
      }, { expand: K[]; } | undefined>(acc_id, opts);
  }

  /**
   * Returns a list of Accounts.
   *
   * @param opts IAccountListOpts: https://docs.methodfi.com/api/core/accounts/list
   * @returns Returns a list of Accounts.
   */

  async list<K extends TAccountExpandableFields = never>(opts?: IAccountListOpts<K>) {
    return super._list<{
      [P in keyof IAccount]: P extends K
      ? Exclude<IAccount[P], string>
      : Extract<IAccount[P], string | null>
    }, IAccountListOpts<K> | undefined>(opts);
  }

  /**
   * Creates a new Account for an Entity, either ach or liability, based on the parameters provided. An account is a unique representation of an ACH or Liability account.
   *
   * @param data Create options: https://docs.methodfi.com/api/core/accounts/create
   * @param requestConfig Allows for idempotency: { idempotency_key?: string }
   * @returns Returns an Account object.
   */

  async create(data: IACHCreateOpts | ILiabilityCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts>(data, requestConfig);
  }


  /**
   * Withdraws an Account’s consent. This endpoint deletes information on the account, sets its status to disabled, and removes all active Products or Subscriptions for the account.
   *
   * @param acc_id id of the account
   * @param data IAccountWithdrawConsentOpts: { type: 'withdraw', reason: 'holder_withdrew_consent' | null }
   * @returns Returns the Account with status set to disabled.
   */

  async withdrawConsent(acc_id: string, data: IAccountWithdrawConsentOpts = { type: 'withdraw', reason: 'holder_withdrew_consent' }) {
    return super._createWithSubPath<IAccount, IAccountWithdrawConsentOpts>(
      `/${acc_id}/consent`,
      data,
    );
  }
};

export default Account;
