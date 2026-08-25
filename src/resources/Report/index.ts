import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';

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
  entities_created_previous_day: 'entities.created.previous_day',
  ach_debit_daily: 'ach.debit.daily',
  reserve_fbo_balance_created_previous_day: 'reserve_fbo_balance.created.previous_day',
} as const;

export type TReportTypes = typeof ReportTypes[keyof typeof ReportTypes];

// Types implemented by POST /reports. Some ReportTypes, such as
// ach.debit.daily, are generated internally and are only readable via the API.
export const ReportCreateTypes = {
  payments_created_current: ReportTypes.payments_created_current,
  payments_created_previous: ReportTypes.payments_created_previous,
  payments_updated_current: ReportTypes.payments_updated_current,
  payments_updated_previous: ReportTypes.payments_updated_previous,
  payments_created_previous_day: ReportTypes.payments_created_previous_day,
  payments_failed_previous_day: ReportTypes.payments_failed_previous_day,
  ach_pull_upcoming: ReportTypes.ach_pull_upcoming,
  ach_pull_previous: ReportTypes.ach_pull_previous,
  ach_pull_nightly: ReportTypes.ach_pull_nightly,
  ach_reversals_nightly: ReportTypes.ach_reversals_nightly,
  entities_created_previous_day: ReportTypes.entities_created_previous_day,
  reserve_fbo_balance_created_previous_day: ReportTypes.reserve_fbo_balance_created_previous_day,
} as const;

export type TReportCreateTypes = typeof ReportCreateTypes[keyof typeof ReportCreateTypes];

export const ReportStatuses = {
  processing: 'processing',
  completed: 'completed',
} as const;

export type TReportStatuses = keyof typeof ReportStatuses;

export interface IReport {
  id: string;
  type: TReportTypes;
  url: string;
  status: TReportStatuses;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
};

export interface IReportCreateOpts {
  type: TReportCreateTypes;
  metadata?: {};
};

export default class Report extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('reports'));
  }

  /**
   * Retrieves the Report associated with the ID.
   * https://docs.methodfi.com/reference/reports/retrieve
   *
   * @param rpt_id id of the report
   * @returns Returns the Report associated with the ID.
   */

  async retrieve(rpt_id: string) {
    return super._getWithId<IResponse<IReport>>(rpt_id);
  }

  /**
   * Creates a new Report for a specific type. Once created, you can retrieve the Report results from the URL returned.
   * https://docs.methodfi.com/reference/reports/create
   *
   * @param opts IReportCreateOpts
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns Returns a Report object.
   */

  async create(opts: IReportCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IReport>, IReportCreateOpts>(opts, requestConfig);
  }

  /**
   * Download a report
   * https://docs.methodfi.com/reference/reports/download
   *
   * @param rpt_id id of the report
   * @returns Returns the Report’s results in CSV format.
   */

  async download(rpt_id: string) {
    return super._download<string>(rpt_id);
  }
};
