import Resource from '../../resource';
import Configuration from '../../configuration';

export const ReportTypes = {
  payments_created_current: 'payments.created.current',
  payments_created_previous: 'payments.created.previous',
  payments_updated_current: 'payments.updated.current',
  payments_updated_previous: 'payments.updated.previous',
};

export type TReportTypes =
  | 'payments.created.current'
  | 'payments.created.previous'
  | 'payments.updated.current'
  | 'payments.updated.previous';

export const ReportStatuses = {
   processing: 'processing',
   completed: 'completed',
}

export type TReportStatuses =
  | 'processing'
  | 'completed';

export interface IReport {
  id: string;
  type: TReportTypes;
  url: string;
  status: TReportStatuses;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
}

export interface TReportCreateOpts {
  type: TReportTypes;
  metadata?: {};
}

export default class Report extends Resource {
  constructor(config: Configuration) {
    super('/reports', config);
  }

  async get(id: string) {
    return super._getWithId<IReport>(id);
  }

  async create(opts: TReportCreateOpts) {
    return super._create<IReport, TReportCreateOpts>(opts);
  }

  async download(id: string) {
    return super._download<string>(id);
  }
};
