// @flow
import { Axios } from 'axios';
import type { TResourceCreationConfig, TResourceOptions } from '../../common/types';
import type { TReportResponse, TReportCreateOptions } from './types';
import get_idempotency_key from '../../utils/resource_config';
import with_error_handler from '../../utils/with_error_handler';

export default class Reports {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TReportCreateOptions, config: TResourceCreationConfig = {}): Promise<TReportResponse> {
    return with_error_handler(async () => {
      const headers = { 'Idempotency-Key': get_idempotency_key(opts, config) };
      return (await this.axios_instance.post('/reports', opts, { headers })).data.data;
    });
  }

  async get(report_id: string): Promise<TReportResponse> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get(`/reports/${report_id}`)).data.data;
    });
  }

  async download(report_id: string): Promise<string> {
    return with_error_handler(async () => {
      return (await this.axios_instance.get(`/reports/${report_id}/download`)).data;
    });
  }
}
