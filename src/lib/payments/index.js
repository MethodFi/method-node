// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../types';
import type { TPaymentCreateOptions, TPaymentResponse } from './types';

export default class Payments {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(payment_id: string): Promise<TPaymentResponse> {
    return (await this.axios_instance.get(`/payments/${payment_id}`)).data.data;
  }

  async list(): Promise<Array<TPaymentResponse>> {
    return (await this.axios_instance.get('/payments')).data.data;
  }

  async create(opts: TPaymentCreateOptions): Promise<TPaymentResponse> {
    return (await this.axios_instance.post('/payments', opts)).data.data;
  }

  async delete(payment_id: string): Promise<TPaymentResponse> {
    return (await this.axios_instance.delete(`/payments/${payment_id}`)).data.data;
  }
}
