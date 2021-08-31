// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../types';
import type { TMerchantListOptions, TMerchantResponse } from './types';

export default class Merchants {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(merchant_id: string): Promise<TMerchantResponse> {
    return (await this.axios_instance.get(`/merchants/${merchant_id}`)).data.data;
  }

  async list(opts: TMerchantListOptions = {}): Promise<Array<TMerchantResponse>> {
    return (await this.axios_instance.get('/merchants', { params: opts })).data.data;
  }
}
