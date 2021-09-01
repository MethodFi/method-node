// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../../common/types';
import type { TEntityCreateOptions, TEntityResponse, TEntityUpdateOptions } from './types';
import get_idempotency_key from '../../utils/resource_config';
import with_error_handler from '../../utils/with_error_handler';

export default class Entities {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TEntityCreateOptions, config: TResourceCreationConfig = {}): Promise<TEntityResponse> {
    return with_error_handler(async () => {
      const headers = { 'Idempotency-Key': get_idempotency_key(opts, config) };
      return (await this.axios_instance.post('/entities', opts, { headers })).data.data;
    });
  }

  async update(entity_id: string, opts: TEntityUpdateOptions): Promise<TEntityResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.put(`/entities/${entity_id}`, opts)).data.data;
    });
  }

  async get(entity_id: string): Promise<TEntityResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get(`/entities/${entity_id}`)).data.data;
    });
  }

  async list(): Promise<Array<TEntityResponse>> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get('/entities')).data.data;
    });
  }
}
