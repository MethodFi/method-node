import Resource from '../../resource';
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

export interface IMicroDepositsCreateOpts {
  type: 'micro_deposits';
}

export interface IMicroDepositsUpdateOpts {
  micro_deposits: { amounts: number[] };
}


export default class Verification extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('verification'));
  }

  async get() {
    return super._get<IVerification>();
  }

  async create(data: IMXCreateOpts | IPlaidCreateOpts | IMicroDepositsCreateOpts) {
    return super._create<IVerification, IMXCreateOpts | IPlaidCreateOpts | IMicroDepositsCreateOpts>(data);
  }

  async update(data: IMicroDepositsUpdateOpts) {
    return super._update<IVerification, IMicroDepositsUpdateOpts>(data);
  }
}
