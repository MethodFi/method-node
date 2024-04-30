import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';
import type {
  IPlaidBalance,
  IPlaidTransaction,
  IMXAccount,
  IMXTransaction,
  ITellerBalance,
  ITellerTransaction,
} from './externalTypes';

export const AccountVerificationSessionStatuses = {
  pending: 'pending',
  in_progress: 'in_progress',
  verified: 'verified',
  failed: 'failed',
};

export type TAccountVerificationSessionStatuses = keyof typeof AccountVerificationSessionStatuses;

export const AccountVerificationSessionTypes = {
  micro_deposits: 'micro_deposits',
  plaid: 'plaid',
  mx: 'mx',
  teller: 'teller',
  standard: 'standard',
  instant: 'instant',
  pre_auth: 'pre_auth',
};

export type TAccountVerificaionSessionTypes = keyof typeof AccountVerificationSessionTypes;

export const AccountVerificationCheckStatusTypes = {
  pass: 'pass',
  fail: 'fail',
};

export type TAccountVerificationPassFail = keyof typeof AccountVerificationCheckStatusTypes;

export interface IAccountVerificationSessionMicroDeposits {
  amounts: number[] | [];
};

export interface IAccountVerificaitonSessionPlaid {
  balances: IPlaidBalance | {};
  transactions: IPlaidTransaction[] | [];
};

export interface IAccountVerificationSessionMX {
  account: IMXAccount | {};
  transactions: IMXTransaction[] | [];
};

export interface IAccountVerificationSessionTeller {
  balances: ITellerBalance | {};
  transactions: ITellerTransaction[] | [];
};

// TODO: Implement the following interfaces
export interface IAccountVerificationSessionTrustProvisioner {};
export interface IAccountVerificationSessionAutoVerify {};
export interface IAccountVerificationSessionThreeDS {};
export interface IAccountVerificationSessionIssuer {};

export interface IAccountVerificationSessionStandard {
  number: string;
};

export interface IAccountVerificationSessionInstant {
  exp_year?: string | null;
  exp_month?: string | null;
  exp_check?: TAccountVerificationPassFail | null;
  number?: string | null;
};

export interface IAccountVerificationSessionPreAuth extends IAccountVerificationSessionInstant {
  cvv: string | null;
  cvv_check: TAccountVerificationPassFail | null;
  billing_zip_code: string | null;
  billing_zip_code_check: TAccountVerificationPassFail | null;
  pre_auth_check: TAccountVerificationPassFail | null;
};

export interface IAccountVerificationSessionCreateOpts {
  type: TAccountVerificaionSessionTypes;
};

export interface IAccountVerificationSessionMicroDepositsUpdateOpts {
  micro_deposits: IAccountVerificationSessionMicroDeposits;
};

export interface IAccountVerificationSessionPlaidUpdateOpts {
  plaid: IAccountVerificaitonSessionPlaid;
};

export interface IAccountVerificationSessionMXUpdateOpts {
  mx: IAccountVerificationSessionMX;
};

export interface IAccountVerificationSessionTellerUpdateOpts {
  teller: IAccountVerificationSessionTeller;
};

export interface IAccountVerificationSessionStandardUpdateOpts {
  standard: IAccountVerificationSessionStandard;
};

export interface IAccountVerificationSessionInstantUpdateOpts {
  instant: IAccountVerificationSessionInstant;
};

export interface IAccountVerificationSessionPreAuthUpdateOpts {
  pre_auth: IAccountVerificationSessionPreAuth;
};

export type IAccountVerificationSessionUpdateOpts =
  | IAccountVerificationSessionMicroDepositsUpdateOpts
  | IAccountVerificationSessionPlaidUpdateOpts
  | IAccountVerificationSessionMXUpdateOpts
  | IAccountVerificationSessionTellerUpdateOpts
  | IAccountVerificationSessionStandardUpdateOpts
  | IAccountVerificationSessionInstantUpdateOpts
  | IAccountVerificationSessionPreAuthUpdateOpts;

export interface IAccountVerificationSession {
  id: string;
  account_id: string;
  status: TAccountVerificationSessionStatuses;
  type: TAccountVerificaionSessionTypes;
  error: IResourceError | null;
  plaid?: IAccountVerificaitonSessionPlaid | null;
  mx?: IAccountVerificationSessionMX | null;
  teller?: IAccountVerificationSessionTeller | null;
  micro_deposits?: IAccountVerificationSessionMicroDeposits | null;
  trusted_provisioner?: IAccountVerificationSessionTrustProvisioner | null;
  auto_verify?: IAccountVerificationSessionAutoVerify | null;
  standard?: IAccountVerificationSessionStandard | null;
  instant?: IAccountVerificationSessionInstant | null;
  pre_auth?: IAccountVerificationSessionPreAuth | null;
  three_ds?: IAccountVerificationSessionThreeDS | null;
  issuer?: IAccountVerificationSessionIssuer | null;
  created_at: string;
  updated_at: string; 
};

export default class AccountVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Retrieve an AccountVerificationSession object by its ID.
   * 
   * @param avs_id ID of the AccountVerificationSession object.
   * @returns AccountVerificationSession object.
   */

  async retrieve(avs_id: string) {
    return super._getWithId<IAccountVerificationSession>(avs_id);
  }

  /**
   * Creates an AccountVerificationSession of the provided type.
   * 
   * @param data IAccountVerificationSessionCreateOpts: { type: TAccountVerificaionSessionTypes }
   * @returns AccountVerificationSession object.
   */

  async create(data: IAccountVerificationSessionCreateOpts) {
    return super._create<IAccountVerificationSession, IAccountVerificationSessionCreateOpts>(data);
  }
  // TODO: Add URL of docs page for this method.
  /**
   * Updates an existing AccountVerificationSession object
   * 
   * @param avs_id ID of the AccountVerificationSession object.
   * @param data Update data for the AccountVerificationSession object based on it's type.
   * @returns AccountVerificationSession object.
   */

  async update(avs_id: string, data: IAccountVerificationSessionUpdateOpts) {
    return super._updateWithId<IAccountVerificationSession, IAccountVerificationSessionUpdateOpts>(avs_id, data);
  }
};
