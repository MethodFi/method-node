// @flow
import { Axios } from 'axios';
import type { TBINResponse } from './types';
import with_error_handler from '../../utils/with_error_handler';
import type { TResourceOptions } from '../../common/types';

export default class BINs {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async get(bin: string): Promise<TBINResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get('/bins', { params: { bin } })).data.data;
    });
  }
}
