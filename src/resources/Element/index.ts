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

export default class Element extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('elements'));
  }

  async createToken(opts: IElementTokenCreateOpts) {
    return super._createWithSubPath<IElement, IElementTokenCreateOpts>('/token', opts);
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
