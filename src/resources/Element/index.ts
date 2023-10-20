import Resource from '../../resource';
import Configuration from '../../configuration';
import { IAccount } from '../Account';

export const ElementTypes = {
  link: 'link',
  auth: 'auth',
};

export type TElementTypes =
  | 'link'
  | 'auth';

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
  AUTH_INTRO_OPEN: 'AUTH_INTRO_OPEN',
  AUTH_INTRO_CONTINUE: 'AUTH_INTRO_CONTINUE',
  AUTH_INTRO_CLOSE: 'AUTH_INTRO_CLOSE',

  AUTH_NAME_OPEN: 'AUTH_NAME_OPEN',
  AUTH_NAME_CONTINUE: 'AUTH_NAME_CONTINUE',
  AUTH_NAME_CLOSE: 'AUTH_NAME_CLOSE',

  AUTH_PHONE_OPEN: 'AUTH_PHONE_OPEN',
  AUTH_PHONE_CONTINUE: 'AUTH_PHONE_CONTINUE',
  AUTH_PHONE_CLOSE: 'AUTH_PHONE_CLOSE',

  AUTH_PHONE_VERIFY_OPEN: 'AUTH_PHONE_VERIFY_OPEN',
  AUTH_PHONE_VERIFY_SUBMIT: 'AUTH_PHONE_VERIFY_SUBMIT',
  AUTH_PHONE_VERIFY_CLOSE: 'AUTH_PHONE_VERIFY_CLOSE',

  AUTH_DOB_OPEN: 'AUTH_DOB_OPEN',
  AUTH_DOB_CONTINUE: 'AUTH_DOB_CONTINUE',
  AUTH_DOB_CLOSE: 'AUTH_DOB_CLOSE',

  AUTH_ADDRESS_OPEN: 'AUTH_ADDRESS_OPEN',
  AUTH_ADDRESS_CONTINUE: 'AUTH_ADDRESS_CONTINUE',
  AUTH_ADDRESS_CLOSE: 'AUTH_ADDRESS_CLOSE',

  AUTH_INCORRECT_INFO_OPEN: 'AUTH_INCORRECT_INFO_OPEN',
  AUTH_INCORRECT_INFO_TRY_AGAIN: 'AUTH_INCORRECT_INFO_TRY_AGAIN',

  AUTH_INVALID_INFO_OPEN: 'AUTH_INVALID_INFO_OPEN',
  AUTH_INVALID_INFO_EXIT: 'AUTH_INVALID_INFO_EXIT',

  AUTH_SECQ_OPEN: 'AUTH_SECQ_OPEN',
  AUTH_SECQ_CONTINUE: 'AUTH_SECQ_CONTINUE',
  AUTH_SECQ_CLOSE: 'AUTH_SECQ_CLOSE',

  AUTH_SECQ_INCORRECT_OPEN: 'AUTH_SECQ_INCORRECT_OPEN',
  AUTH_SECQ_INCORRECT_TRY_AGAIN: 'AUTH_SECQ_INCORRECT_TRY_AGAIN',
  AUTH_SECQ_INCORRECT_CLOSE: 'AUTH_SECQ_INCORRECT_CLOSE',

  AUTH_CONSENT_OPEN: 'AUTH_CONSENT_OPEN',
  AUTH_CONSENT_CONTINUE: 'AUTH_CONSENT_CONTINUE',
  AUTH_CONSENT_CLOSE: 'AUTH_CONSENT_CLOSE',

  AUTH_SUCCESS_OPEN: 'AUTH_SUCCESS_OPEN',
  AUTH_SUCCESS_CONTINUE: 'AUTH_SUCCESS_CONTINUE',
  AUTH_FAILURE_OPEN: 'AUTH_FAILURE_OPEN',
  AUTH_FAILURE_CONTINUE: 'AUTH_FAILURE_CONTINUE',
};

export type TUserEventType =
  | 'AUTH_INTRO_OPEN'
  | 'AUTH_INTRO_CONTINUE'
  | 'AUTH_INTRO_CLOSE'

  | 'AUTH_NAME_OPEN'
  | 'AUTH_NAME_CONTINUE'
  | 'AUTH_NAME_CLOSE'

  | 'AUTH_PHONE_OPEN'
  | 'AUTH_PHONE_CONTINUE'
  | 'AUTH_PHONE_CLOSE'

  | 'AUTH_PHONE_VERIFY_OPEN'
  | 'AUTH_PHONE_VERIFY_SUBMIT'
  | 'AUTH_PHONE_VERIFY_CLOSE'

  | 'AUTH_DOB_OPEN'
  | 'AUTH_DOB_CONTINUE'
  | 'AUTH_DOB_CLOSE'

  | 'AUTH_ADDRESS_OPEN'
  | 'AUTH_ADDRESS_CONTINUE'
  | 'AUTH_ADDRESS_CLOSE'

  | 'AUTH_INCORRECT_INFO_OPEN'
  | 'AUTH_INCORRECT_INFO_TRY_AGAIN'

  | 'AUTH_INVALID_INFO_OPEN'
  | 'AUTH_INVALID_INFO_EXIT'

  | 'AUTH_SECQ_OPEN'
  | 'AUTH_SECQ_CONTINUE'
  | 'AUTH_SECQ_CLOSE'

  | 'AUTH_SECQ_INCORRECT_OPEN'
  | 'AUTH_SECQ_INCORRECT_TRY_AGAIN'
  | 'AUTH_SECQ_INCORRECT_CLOSE'

  | 'AUTH_CONSENT_OPEN'
  | 'AUTH_CONSENT_CONTINUE'
  | 'AUTH_CONSENT_CLOSE'

  | 'AUTH_SUCCESS_OPEN'
  | 'AUTH_SUCCESS_CONTINUE'

  | 'AUTH_FAILURE_OPEN'
  | 'AUTH_FAILURE_CONTINUE';

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
