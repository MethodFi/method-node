import { TAccountLiabilityTypes } from '../Account/types';

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

export const ElementTypes = {
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

export type TElementSelectionTypes =
  | 'single'
  | 'multiple';

export interface IElementUserEvent {
  type: TUserEventType,
  timestamp: string,
  metadata: {} | null,
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

export interface IConnectElementFilterOpts {
  selection_type?: TElementSelectionTypes;
  liability_types?: TAccountLiabilityTypes[];
};

export interface IConnectElementCreateOpts {
  products?: TElementProductTypes[];
  accounts?: string[];
  entity?: IElementEntityOpts;
  account_filters?: IConnectElementFilterOpts;
};

export interface IBalanceTransferElementCreateOpts {
  payout_amount_min: number;
  minimum_loan_amount: number;
  payout_residual_amount_max: number;
  loan_details_requested_amount: number;
  loan_details_requested_rate: number;
  loan_details_requested_term: number;
  loan_details_requested_monthly_payment: number;
};

export interface IElementTokenCreateOpts {
  type: TElementTypes;
  entity_id?: string;
  team_name?: string;
  team_logo?: string | null;
  team_icon?: string | null;
  connect?: IConnectElementCreateOpts;
  balance_transfer?: IBalanceTransferElementCreateOpts;
};

export interface IElementToken {
  element_token: string;
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
