import Resource, { IRequestConfig, IResourceError } from '../../resource';
import Configuration from '../../configuration';

export const VerificationStatuses = {
  initiated: 'initiated',
  pending: 'pending',
  verified: 'verified',
  disabled: 'disabled',
};

export type TVerificationStatuses =
  | 'initiated'
  | 'pending'
  | 'verified'
  | 'disabled';

export const VerificationTypes = {
  micro_deposits: 'micro_deposits',
  plaid: 'plaid',
  mx: 'mx',
  teller: 'teller',
  auto_verify: 'auto_verify',
  trusted_provisioner: 'trusted_provisioner',
};

export type TVerificationTypes =
  | 'micro_deposits'
  | 'plaid'
  | 'mx'
  | 'auto_verify'
  | 'trusted_provisioner';

export interface IVerification {
  id: string;
  status: TVerificationStatuses;
  type: TVerificationTypes;
  error: IResourceError | null;
  initiated_at: string;
  pending_at: string;
  verified_at: string;
  disabled_at: string;
  created_at: string;
  updated_at: string;
}

export interface IMXCreateOpts {
  type: 'mx';
  mx: { accounts: {}, transactions: any[] };
}

export interface IPlaidCreateOpts {
  type: 'plaid';
  plaid: { balances: {}, transactions: any[] };
}

export interface ITellerCreateOpts {
  type: 'teller';
  teller: { balances: {}, transactions: any[] };
}

export interface IMicroDepositsCreateOpts {
  type: 'micro_deposits';
}

export interface IMicroDepositsUpdateOpts {
  micro_deposits: { amounts: number[] };
}

export interface IMicroDepositsTestAmountsResponse {
  amounts: number[];
}


export default class Verification extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification'));
  }

  /**
   * Returns the verification associated with an ACH account.
   * 
   * @returns IVerification
   */

  async retrieve() {
    return super._get<IVerification>();
  }

  /**
   * Verify an ACH account through micro-deposits, or by providing raw data from Plaid/Teller/MX.
   * 
   * @param data Depending on the type of verification, use the payloads found in the documentation: https://docs.methodfi.com/api/core/accounts/ach-verification/object
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns Results based on type of verification requested
   */

  async create(
    data: IMXCreateOpts | IPlaidCreateOpts | IMicroDepositsCreateOpts | ITellerCreateOpts,
    requestConfig?: IRequestConfig,
  ) {
    return super._create<IVerification, IMXCreateOpts | IPlaidCreateOpts | IMicroDepositsCreateOpts | ITellerCreateOpts>(
      data,
      requestConfig,
    );
  }

  /**
   * This endpoint is to confirm the two amounts (in cents) deposited into the associated ACH account. Only verifications of type micro_deposits are allowed to be updated.
   * 
   * @param data Microdeposit amounts: https://docs.methodfi.com/api/core/accounts/ach-verification/update
   * @returns IVerification
   */

  async update(data: IMicroDepositsUpdateOpts) {
    return super._update<IVerification, IMicroDepositsUpdateOpts>(data);
  }

  async getTestAmounts() {
    return super._getWithSubPath<IMicroDepositsTestAmountsResponse>('/amounts');
  }
}
