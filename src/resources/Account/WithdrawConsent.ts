import Resource from '../../resource';
import Configuration from '../../configuration';
import type { IAccount } from './types';

export interface IAccountWithdrawConsentOpts {
  type: 'withdraw';
  reason: 'holder_withdrew_consent' | null;
};

export default class AccountWithdrawConsent extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('consent'));
  }

  /**
   * Withdraws consent for an account
   * 
   * @param data IAccountWithdrawConsentOpts: { type: 'withdraw', reason: 'holder_withdrew_consent' | null }
   * @returns IAccount
   */
  
  async create(data: IAccountWithdrawConsentOpts = { type: 'withdraw', reason: 'holder_withdrew_consent' }) {
    return super._create<IAccount, IAccountWithdrawConsentOpts>(data);
  }
};