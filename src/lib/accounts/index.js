// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../../common/types';
import type { TAccountCreateOptions, TAccountListOptions, TAccountResponse } from './types';
import get_idempotency_key from '../../utils/resource_config';
import with_error_handler from '../../utils/with_error_handler';

export default class Accounts {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TAccountCreateOptions, config: TResourceCreationConfig = {}): Promise<TAccountResponse> {
    return with_error_handler(async () => {
      const headers = { 'Idempotency-Key': get_idempotency_key(opts, config) };
      return (await this.axios_instance.post('/accounts', opts, { headers })).data.data;
    });
  }

  async get(account_id: string): Promise<TAccountResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get(`/accounts/${account_id}`)).data.data;
    });
  }

  async list(opts: TAccountListOptions = {}): Promise<Array<TAccountResponse>> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get('/accounts', { params: opts })).data.data;
    });
  }
}
