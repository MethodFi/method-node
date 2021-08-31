// @flow
import { Axios } from 'axios';
import type { TResourceOptions } from '../types';
import type { TReportResponse, TReportCreateOptions } from './types';

export default class Reports {
  // $FlowFixMe
  axios_instance: Axios;

  constructor(opts: TResourceOptions) {
    this.axios_instance = opts.axios_instance;
  }

  async create(opts: TReportCreateOptions): Promise<TReportResponse> {
    return (await this.axios_instance.post('/reports', opts)).data.data;
  }

  async get(report_id: string): Promise<TReportResponse> {
    return (await this.axios_instance.get(`/reports/${report_id}`)).data.data;
  }

  async download(report_id: string): Promise<string> {
    return (await this.axios_instance.get(`/reports/${report_id}/download`)).data.data;
  }
}
