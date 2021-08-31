// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../types';
import type { TEntityCreateOptions, TEntityResponse, TEntityUpdateOptions } from './types';

export default class Entities {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TEntityCreateOptions, config: TResourceCreationConfig): Promise<TEntityResponse> {
    return (await this.axios_instance.post('/entities', opts)).data.data;
  }

  async update(entity_id: string, opts: TEntityUpdateOptions): Promise<TEntityResponse> {
    return (await this.axios_instance.put(`/entities/${entity_id}`, opts)).data.data;
  }

  async get(entity_id: string): Promise<TEntityResponse> {
    return (await this.axios_instance.get(`/entities/${entity_id}`)).data.data;
  }

  async list(): Promise<Array<TEntityResponse>> {
    return (await this.axios_instance.get('/entities')).data.data;
  }
}
