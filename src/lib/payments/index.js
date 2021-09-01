// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../../common/types';
import type { TPaymentCreateOptions, TPaymentResponse } from './types';
import { get_idempotency_key } from '../../utils/resource_config';
import { with_error_handler } from '../../utils/with_error_handler';

export default class Payments {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(payment_id: string): Promise<TPaymentResponse> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.get(`/payments/${payment_id}`)).data.data;
    });
  }

  async list(): Promise<Array<TPaymentResponse>> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.get('/payments')).data.data;
    });
  }

  async create(opts: TPaymentCreateOptions, config: TResourceCreationConfig = {}): Promise<TPaymentResponse> {
    return await with_error_handler(async () => {
      const headers = {'Idempotency-Key': get_idempotency_key(opts, config)};
      return (await this.axios_instance.post('/payments', opts, {headers})).data.data;
    });
  }

  async delete(payment_id: string): Promise<TPaymentResponse> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.delete(`/payments/${payment_id}`)).data.data;
    });
  }
}
