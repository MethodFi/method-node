// @flow
import { Axios } from 'axios';
import type { TRoutingNumberResponse } from './types';
import { with_error_handler } from '../../utils/with_error_handler';
import type { TResourceOptions } from '../../common/types';


export default class RoutingNumbers {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(routing_number: string): Promise<TRoutingNumberResponse> {
    return await with_error_handler(async () => {
      return (await this.axios_instance.get('/routing_numbers', { params: { routing_number } })).data.data;
    });
  }
}
