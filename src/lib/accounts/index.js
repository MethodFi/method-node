// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../types';
import type { TAccountCreateOptions, TAccountListOptions, TAccountResponse } from './types';

export default class Accounts {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TAccountCreateOptions, config: TResourceCreationConfig): Promise<TAccountResponse> {
    return (await this.axios_instance.post('/accounts', opts)).data.data;
  }

  async get(account_id: string): Promise<TAccountResponse> {
    return (await this.axios_instance.get(`/accounts/${account_id}`)).data.data;
  }

  async list(opts: TAccountListOptions = {}): Promise<Array<TAccountResponse>> {
    return (await this.axios_instance.get('/accounts', { params: opts })).data.data;
  }
}
