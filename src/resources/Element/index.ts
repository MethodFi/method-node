import Resource from '../../resource';
import Configuration from '../../configuration';
import { IAccount } from '../Account';

export const ElementTypes = {
  link: 'link',
};

export type TElementTypes =
  | 'link';

export interface ILinkElementLinkCreateOpts {
  mch_id?: string;
  mask?: string;
}

export interface IElementTokenCreateOpts {
  entity_id: string;
  type: TElementTypes;
  team_name: string;
  link?: ILinkElementLinkCreateOpts;
}

export interface IElement {
  element_token: string;
}

export interface IElementExchangePublicAccountOpts {
  public_account_token: string;
}

export default class Element extends Resource {
  constructor(config: Configuration) {
    super('/elements', config);
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
};
