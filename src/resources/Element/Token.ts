import Resource from '../../resource';
import Configuration from '../../configuration';
import { TAccountLiabilityTypes } from '../Account/types';

export const UserEventType = {
  // Auth session
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
  AUTH_PHONE_VERIFY_RESEND_CODE: 'AUTH_PHONE_VERIFY_RESEND_CODE',
  AUTH_PHONE_VERIFY_CLOSE: 'AUTH_PHONE_VERIFY_CLOSE',

  AUTH_DOB_OPEN: 'AUTH_DOB_OPEN',
  AUTH_DOB_CONTINUE: 'AUTH_DOB_CONTINUE',
  AUTH_DOB_CLOSE: 'AUTH_DOB_CLOSE',

  AUTH_ADDRESS_OPEN: 'AUTH_ADDRESS_OPEN',
  AUTH_ADDRESS_CONTINUE: 'AUTH_ADDRESS_CONTINUE',
  AUTH_ADDRESS_CLOSE: 'AUTH_ADDRESS_CLOSE',

  AUTH_SSN4_OPEN: 'AUTH_SSN4_OPEN',
  AUTH_SSN4_CONTINUE: 'AUTH_SSN4_CONTINUE',
  AUTH_SSN4_CLOSE: 'AUTH_SSN4_CLOSE',

  AUTH_SECQ_OPEN: 'AUTH_SECQ_OPEN',
  AUTH_SECQ_CONTINUE: 'AUTH_SECQ_CONTINUE',
  AUTH_SECQ_CLOSE: 'AUTH_SECQ_CLOSE',
  AUTH_SECQ_INCORRECT_TRY_AGAIN: 'AUTH_SECQ_INCORRECT_TRY_AGAIN',

  AUTH_CONSENT_OPEN: 'AUTH_CONSENT_OPEN',
  AUTH_CONSENT_CONTINUE: 'AUTH_CONSENT_CONTINUE',
  AUTH_CONSENT_CLOSE: 'AUTH_CONSENT_CLOSE',

  AUTH_SUCCESS_OPEN: 'AUTH_SUCCESS_OPEN',
  AUTH_SUCCESS_CONTINUE: 'AUTH_SUCCESS_CONTINUE',

  AUTH_FAILURE_OPEN: 'AUTH_FAILURE_OPEN',
  AUTH_FAILURE_CONTINUE: 'AUTH_FAILURE_CONTINUE',

  AVF_ACCOUNT_LIST_OPEN: 'AVF_ACCOUNT_LIST_OPEN',
  AVF_ACCOUNT_LIST_CLOSE: 'AVF_ACCOUNT_LIST_CLOSE',

  AVF_LEARN_MORE_OPEN: 'AVF_LEARN_MORE_OPEN',
  AVF_LEARN_MORE_CLOSE: 'AVF_LEARN_MORE_CLOSE',

  AVF_ACCOUNT_VERIFY_OPEN: 'AVF_ACCOUNT_VERIFY_OPEN',
  AVF_ACCOUNT_VERIFY_SUBMIT: 'AVF_ACCOUNT_VERIFY_SUBMIT',
  AVF_ACCOUNT_VERIFY_CLOSE: 'AVF_ACCOUNT_VERIFY_CLOSE',

  AVF_SUCCESS_OPEN: 'AVF_SUCCESS_OPEN',
  AVF_SUCCESS_CONTINUE: 'AVF_SUCCESS_CONTINUE',

  AVF_EMPTY_SUCCESS_OPEN: 'AVF_EMPTY_SUCCESS_OPEN',
  AVF_EMPTY_SUCCESS_CONTINUE: 'AVF_EMPTY_SUCCESS_CONTINUE',

  AVF_SKIP_ALL: 'AVF_SKIP_ALL',
  AVF_ERROR: 'AVF_ERROR',
};

export type TUserEventType = keyof typeof UserEventType;

export interface IElementUserEvent {
  type: TUserEventType,
  timestamp: string,
  metadata: {} | null,
};

export const ElementTypes = {
  auth: 'auth',
  connect: 'connect',
  balance_transfer: 'balance_transfer',
};

export type TElementTypes = keyof typeof ElementTypes;

export const ElementProducts = {
  balance: 'balance',
  payoff: 'payoff',
  transactions: 'transactions',
  card_brand: 'card_brand',
  update: 'update',
  sensitive: 'sensitive',
  payment: 'payment',
};

export type TElementProductTypes = keyof typeof ElementProducts;

export const ElementMetadataOpTypes = {
  open: 'open',
  continue: 'continue',
  close: 'close',
  success: 'success',
  exit: 'exit',
};

export type TElementMetadataOpTypes = keyof typeof ElementMetadataOpTypes;

export type TAuthElementAccountFilterCapabilities =
  | 'payments:receive'
  | 'data:sync';

export type TAuthElementAccountFilterSelectionTypes =
  | 'single'
  | 'multiple';

export interface ILinkElementCreateOpts {
  mch_id?: string;
  mask?: string;
};

export interface IAuthElementAccountFiltersOpts {
  selection_type?: TAuthElementAccountFilterSelectionTypes;
  capabilities?: TAuthElementAccountFilterCapabilities[];
  types?: TAccountLiabilityTypes[];
};

export interface IElementEntityOpts {
  type: 'individual';
  individual: {
    first_name?: string;
    last_name?: string;
    dob?: string;
    email?: string;
    phone?: string;
    phone_verification_type?: 'sms' | 'tos';
    phone_verification_timestamp?: string;
  };
};

export interface IAuthElementCreateOpts {
  account_filters?: IAuthElementAccountFiltersOpts;
  entity?: IElementEntityOpts;
};

export interface IConnectElementFilterOpts {
  selection_type?: TAuthElementAccountFilterSelectionTypes;
  liability_types?: TAccountLiabilityTypes[];
};

export interface IConnectElementCreateOpts {
  products?: TElementProductTypes[];
  accounts?: string[];
  entity?: IElementEntityOpts;
  account_filters?: IConnectElementFilterOpts;
};

export interface IElementTokenCreateOpts {
  type: TElementTypes;
  entity_id?: string;
  team_name?: string;
  team_logo?: string | null;
  team_icon?: string | null;
  connect?: IConnectElementCreateOpts;
  auth?: IAuthElementCreateOpts;
};

export interface IElementToken {
  element_token: string;
};

export interface IElementExchangePublicAccountOpts {
  public_account_token?: string;
  public_account_tokens?: string[];
};

export interface IElementMetadata {
  element_type: TElementTypes;
  op: TElementMetadataOpTypes;
};

export interface IElementResults {
  authenticated: boolean;
  cxn_id: string | null;
  accounts: string[];
  entity_id: string | null;
  events: IElementUserEvent[];
};

export default class ElementToken extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('token'));
  }
  
  /**
   * Creates token to be used with Element
   * 
   * @param opts IElementTokenCreateOpts
   * @returns IElement { element_token: string };
   */

  async create(opts: IElementTokenCreateOpts) {
    return super._create<IElementToken, IElementTokenCreateOpts>(opts);
  }

  /**
   * Retrieve the results of an Element session.
   * 
   * @param pk_elem_id ID of the Element token
   * @returns Returns an ElementResults object.
   */
  
  async results(pk_elem_id: string) {
    return super._getWithSubPath<IElementResults>(`${pk_elem_id}/results`);
  }
};
