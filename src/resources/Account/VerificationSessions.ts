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

/**
 * {
  "id": "avf_bxDxWqdnRcrer",
  "account_id": "acc_yVf3mkzbhz9tj",
  "status": "pending",
  "type": "micro_deposits",
  "error": null,
  "plaid": null,
  "mx": null,
  "teller": null,
  "micro_deposits": {
    "amounts": []
  },
  "trusted_provisioner": null,
  "auto_verify": null,
  "standard": null,
  "instant": null,
  "pre_auth": null,
  "three_ds": null,
  "issuer": null,
  "created_at": "2024-03-29T21:32:54.452Z",
  "updated_at": "2024-03-29T21:32:54.452Z"
}
 */

export const AccountVerificationSessionStatuses = {
  completed: 'completed',
  in_progress: 'in_progress',
  verified: 'verified',
  failed: 'failed',
};

export type TAccountVerificationSessionStatuses =
  | 'completed'
  | 'in_progress'
  | 'verified'
  | 'failed';

export const AccountVerificationSessionTypes = {
  micro_deposits: 'micro_deposits',
  plaid: 'plaid',
  mx: 'mx',
  teller: 'teller',
  standard: 'standard',
  instant: 'instant',
  pre_auth: 'pre_auth',
};

export type TAccountVerificaionSessionTypes =
  | 'micro_deposits'
  | 'plaid'
  | 'mx'
  | 'teller'
  | 'standard'
  | 'instant'
  | 'pre_auth';

export interface IAccountVerificationSessionMicroDeposits {
  amounts: number[];
};

export interface IAccountVerificaitonSessionPlaid {
  balances: IPlaidBalance;
  transactions: IPlaidTransaction[];
};

export interface IAccountVerificationSessionMX {
  account: IMXAccount;
  transactions: IMXTransaction[];
};

export interface IAccountVerificationSessionTeller {
  balances: ITellerBalance;
  transactions: ITellerTransaction[];
};

export interface IAccountVerificationSession {
  id: string;
  account_id: string;
  status: TAccountVerificationSessionStatuses;
  type: TAccountVerificaionSessionTypes;
  error: IResourceError | null;
  plaid: IAccountVerificaitonSessionPlaid | null;
  mx: IAccountVerificationSessionMX | null;
  teller: IAccountVerificationSessionTeller | null;
  micro_deposits: IAccountVerificationSessionMicroDeposits | null;
  trusted_provisioner: any;
  auto_verify: any;
  standard: any;
  instant: any;
  pre_auth: any;
  three_ds: any;
  issuer: any;
  created_at: string;
  updated_at: string; 
};