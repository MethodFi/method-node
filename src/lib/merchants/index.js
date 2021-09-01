// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../../common/types';
import type { TMerchantListOptions, TMerchantResponse } from './types';
import { with_error_handler } from '../../utils/with_error_handler';

export default class Merchants {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(merchant_id: string): Promise<TMerchantResponse> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.get(`/merchants/${merchant_id}`)).data.data;
    });
  }

  async list(opts: TMerchantListOptions = {}): Promise<Array<TMerchantResponse>> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.get('/merchants', {params: opts})).data.data;
    });
  }
}
