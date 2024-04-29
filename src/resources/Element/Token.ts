import Resource from '../../resource';
import Configuration from '../../configuration';

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

export type TUserEventType = keyof typeof UserEventType;

export interface IElementUserEvent {
  type: TUserEventType,
  timestamp: Date,
  metadata: {} | null,
};

export const ElementTypes = {
  link: 'link',
  auth: 'auth',
  connect: 'connect',
  balance_transfer: 'balance_transfer',
};

export type TElementTypes = keyof typeof ElementTypes;

export const ElementProducts = {
  balance: 'balance',
  payoff: 'payoff',
  transactions: 'transactions',
  card: 'card',
  update: 'update',
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

export type TAuthElementAccountFilterTypes =
  | 'auto_loan'
  | 'mortgage'
  | 'credit_card'
  | 'loan'
  | 'student_loan'
  | 'personal_loan';

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
  types?: TAuthElementAccountFilterTypes[];
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

export interface IElementConnectOpts {
  products: TElementProductTypes[];
  accounts: string[];
  entity: IElementEntityOpts;
};

export interface IElementTokenCreateOpts {
  type: TElementTypes;
  entity_id?: string;
  connect?: IElementConnectOpts;
  link?: ILinkElementCreateOpts;
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
    return super._createWithSubPath<IElementToken, IElementTokenCreateOpts>('/token', opts);
  }

  /**
   * Retrieve the results of an Element session.
   * 
   * @param pk_elem_id ID of the Element token
   * @returns Returns an ElementResults object.
   */
  
  async results() {
    return super._get<IElementResults>();
  }
};
