import Resource from '../../resource';
import Configuration from '../../configuration';
import { IAccount } from '../Account';

export const ElementTypes = {
  link: 'link',
  auth: 'auth',
  transfer: 'transfer',
  transaction_stream: 'transaction_stream',
  balance_transfer: 'balance_transfer',
};

export type TElementTypes =
  | 'link'
  | 'auth'
  | 'transfer'
  | 'transaction_stream'
  | 'balance_transfer';

export type TAuthElementAccountFilterTypes =
  | 'auto_loan'
  | 'mortgage'
  | 'credit_card'
  | 'loan'
  | 'student_loan'
  | 'personal_loan'

export type TAuthElementAccountFilterCapabilities =
  | 'payments:receive'
  | 'data:sync';

export type TAuthElementAccountFilterSelectionTypes =
  | 'single'
  | 'multiple';

export const UserEventType = {
  auth_intro_open: 'auth_intro_open',
  auth_intro_continue: 'auth_intro_continue',
  auth_intro_close: 'auth_intro_close',
  auth_name_open: 'auth_name_open',
  auth_name_continue: 'auth_name_continue',
  auth_name_close: 'auth_name_close',
  auth_phone_open: 'auth_phone_open',
  auth_phone_continue: 'auth_phone_continue',
  auth_phone_close: 'auth_phone_close',
  auth_phone_verify_open: 'auth_phone_verify_open',
  auth_phone_verify_submit: 'auth_phone_verify_submit',
  auth_phone_verify_close: 'auth_phone_verify_close',
  auth_dob_open: 'auth_dob_open',
  auth_dob_continue: 'auth_dob_continue',
  auth_dob_close: 'auth_dob_close',
  auth_address_open: 'auth_address_open',
  auth_address_continue: 'auth_address_continue',
  auth_address_close: 'auth_address_close',
  auth_incorrect_info_open: 'auth_incorrect_info_open',
  auth_incorrect_info_try_again: 'auth_incorrect_info_try_again',
  auth_invalid_info_open: 'auth_invalid_info_open',
  auth_invalid_info_exit: 'auth_invalid_info_exit',
  auth_secq_open: 'auth_secq_open',
  auth_secq_continue: 'auth_secq_continue',
  auth_secq_close: 'auth_secq_close',
  auth_secq_incorrect_open: 'auth_secq_incorrect_open',
  auth_secq_incorrect_try_again: 'auth_secq_incorrect_try_again',
  auth_secq_incorrect_close: 'auth_secq_incorrect_close',
  auth_consent_open: 'auth_consent_open',
  auth_consent_continue: 'auth_consent_continue',
  auth_consent_close: 'auth_consent_close',
  auth_success_open: 'auth_success_open',
  auth_success_continue: 'auth_success_continue',
  auth_failure_open: 'auth_failure_open',
  auth_failure_continue: 'auth_failure_continue',
};

export type TUserEventType =
  | 'auth_intro_open'
  | 'auth_intro_continue'
  | 'auth_intro_close'
  | 'auth_name_open'
  | 'auth_name_continue'
  | 'auth_name_close'
  | 'auth_phone_open'
  | 'auth_phone_continue'
  | 'auth_phone_close'
  | 'auth_phone_verify_open'
  | 'auth_phone_verify_submit'
  | 'auth_phone_verify_close'
  | 'auth_dob_open'
  | 'auth_dob_continue'
  | 'auth_dob_close'
  | 'auth_address_open'
  | 'auth_address_continue'
  | 'auth_address_close'
  | 'auth_incorrect_info_open'
  | 'auth_incorrect_info_try_again'
  | 'auth_invalid_info_open'
  | 'auth_invalid_info_exit'
  | 'auth_secq_open'
  | 'auth_secq_continue'
  | 'auth_secq_close'
  | 'auth_secq_incorrect_open'
  | 'auth_secq_incorrect_try_again'
  | 'auth_secq_incorrect_close'
  | 'auth_consent_open'
  | 'auth_consent_continue'
  | 'auth_consent_close'
  | 'auth_success_open'
  | 'auth_success_continue'
  | 'auth_failure_open'
  | 'auth_failure_continue';

export interface ILinkElementCreateOpts {
  mch_id?: string;
  mask?: string;
}

export interface IAuthElementAccountFiltersOpts {
  selection_type?: TAuthElementAccountFilterSelectionTypes;
  capabilities?: TAuthElementAccountFilterCapabilities[];
  types?: TAuthElementAccountFilterTypes[];
}

export interface IAuthElementEntityOpts {
  type: 'individual';
  individual: {
    first_name?: string;
    last_name?: string;
    dob?: string;
    email?: string;
    phone?: string;
    phone_verification_type?: 'sms' | 'tos';
    phone_verification_timestamp?: string;
  }
}
export interface IAuthElementCreateOpts {
  account_filters?: IAuthElementAccountFiltersOpts;
  entity?: IAuthElementEntityOpts
}

export interface IElementTokenCreateOpts {
  entity_id?: string;
  type: TElementTypes;
  team_name?: string;
  team_logo?: string | null;
  team_icon?: string | null;
  link?: ILinkElementCreateOpts;
  auth?: IAuthElementCreateOpts;
}

export interface IElement {
  element_token: string;
}

export interface IElementExchangePublicAccountOpts {
  public_account_token?: string;
  public_account_tokens?: string[];
}

export type TElementUserEvent = {
  type: TUserEventType,
  timestamp: Date,
  metadata: {} | null,
};

export interface ITokenSessionResult {
  authenticated: boolean;
  cxn_id: string | null;
  accounts: string[];
  entity_id: string | null;
  events: TElementUserEvent[];
}

export default class Element extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('elements'));
  }

  async createToken(opts: IElementTokenCreateOpts) {
    return super._createWithSubPath<IElement, IElementTokenCreateOpts>('/token', opts);
  }

  async getSessionResults(id: string) {
    return super._getWithSubPath<ITokenSessionResult>(`/token/${id}/results`);
  }

  async exchangePublicAccountToken(public_account_token: string) {
    return super._createWithSubPath<IAccount, IElementExchangePublicAccountOpts>(
      '/accounts/exchange',
      { public_account_token },
    );
  }

  async exchangePublicAccountTokens(public_account_tokens: string[]) {
    return super._createWithSubPath<IAccount, IElementExchangePublicAccountOpts>(
      '/accounts/exchange',
      { public_account_tokens },
    );
  }
};
