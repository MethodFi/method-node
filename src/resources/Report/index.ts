import Resource, { IRequestConfig } from '../../resource';
import Configuration from '../../configuration';

export const ReportTypes = {
  payments_created_current: 'payments.created.current',
  payments_created_previous: 'payments.created.previous',
  payments_updated_current: 'payments.updated.current',
  payments_updated_previous: 'payments.updated.previous',
  payments_created_previous_day: 'payments.created.previous_day',
  payments_failed_previous_day: 'payments.failed.previous_day',
  ach_pull_upcoming: 'ach.pull.upcoming',
  ach_pull_previous: 'ach.pull.previous',
  ach_pull_nightly: 'ach.pull.nightly',
  ach_reversals_nightly: 'ach.reversals.nightly',
  entities_created_previous_day: 'entities.created.previous_day'
};

export type TReportTypes =
  | 'payments.created.current'
  | 'payments.created.previous'
  | 'payments.updated.current'
  | 'payments.updated.previous'
  | 'payments.created.previous_day'
  | 'payments.failed.previous_day'
  | 'ach.pull.upcoming'
  | 'ach.pull.previous'
  | 'ach.pull.nightly'
  | 'ach.reversals.nightly'
  | 'entities.created.previous_day';

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

export interface IReportCreateOpts {
  type: TReportTypes;
  metadata?: {};
}

export default class Report extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('reports'));
  }

  /**
   * Retrieves a report by id
   * 
   * @param rpt_id id of the report
   * @returns IReport
   */

  async retrieve(rpt_id: string) {
    return super._getWithId<IReport>(rpt_id);
  }

  /**
   * Creates a report
   * 
   * @param opts IReportCreateOpts: https://docs.methodfi.com/api/core/reports/create
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns IReport
   */

  async create(opts: IReportCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IReport, IReportCreateOpts>(opts, requestConfig);
  }

  /**
   * Download a report
   * 
   * @param rpt_id id of the report
   * @returns Report csv file
   */

  async download(rpt_id: string) {
    return super._download<string>(rpt_id);
  }
};
