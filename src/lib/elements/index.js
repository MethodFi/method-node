// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../types';
import type { TElementCreateTokenOptions, TElementCreateTokenResponse } from './types';
import type { TAccountResponse } from '../accounts/types';

export default class Elements {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async createToken(opts: TElementCreateTokenOptions): Promise<TElementCreateTokenResponse> {
    return (await this.axios_instance.post('/elements', opts)).data.data;
  }

  async exchangePublicAccountToken(public_account_token: string): Promise<TAccountResponse> {
    return (await this.axios_instance.post('/elements/accounts/exchange', { public_account_token })).data.data;
  }
}
