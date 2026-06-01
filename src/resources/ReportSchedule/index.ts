import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import ReportScheduleTypes from './ReportTypes';
import ReportScheduleDeliveryMethods from './DeliveryMethods';
import ReportScheduleRecipients from './Recipients';
import type {
  IReportSchedule,
  IReportScheduleCreateOpts,
  IReportScheduleUpdateOpts,
} from './types';

export class ReportScheduleSubResources {
  types: ReportScheduleTypes;
  deliveryMethods: ReportScheduleDeliveryMethods;
  recipients: ReportScheduleRecipients;

  constructor(rpt_sch_id: string, config: Configuration) {
    this.types = new ReportScheduleTypes(config.addPath(rpt_sch_id));
    this.deliveryMethods = new ReportScheduleDeliveryMethods(config.addPath(rpt_sch_id));
    this.recipients = new ReportScheduleRecipients(config.addPath(rpt_sch_id));
  }
};

export interface ReportSchedule {
  (rpt_sch_id: string): ReportScheduleSubResources;
};

export class ReportSchedule extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('report_schedules'));
  }

  protected _call(rpt_sch_id: string): ReportScheduleSubResources {
    return new ReportScheduleSubResources(rpt_sch_id, this.config);
  }

  /**
   * Retrieves the Report Schedule associated with the ID.
   * https://docs.methodfi.com/reference/report-schedules/retrieve
   *
   * @param rpt_sch_id id of the Report Schedule
   * @returns Returns the Report Schedule associated with the ID.
   */

  async retrieve(rpt_sch_id: string) {
    return super._getWithId<IResponse<IReportSchedule>>(rpt_sch_id);
  }

  /**
   * Returns all the active Report Schedules associated with your team, or an empty array if none have been created.
   * https://docs.methodfi.com/reference/report-schedules/list
   *
   * @returns Returns a list of Report Schedule objects.
   */

  async list() {
    return super._list<IResponse<IReportSchedule>>();
  }

  /**
   * Creates a new Report Schedule. Once created, the first run is queued immediately for the next scheduled date.
   * https://docs.methodfi.com/reference/report-schedules/create
   *
   * @param opts IReportScheduleCreateOpts
   * @param requestConfig Idempotency key: { idempotency_key: string }
   * @returns Returns the newly created Report Schedule object.
   */

  async create(opts: IReportScheduleCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IReportSchedule>, IReportScheduleCreateOpts>(opts, requestConfig);
  }

  /**
   * Updates the cron expression of an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/update
   *
   * @param rpt_sch_id id of the Report Schedule
   * @param opts IReportScheduleUpdateOpts: { cron: string }
   * @returns Returns the updated Report Schedule object.
   */

  async update(rpt_sch_id: string, opts: IReportScheduleUpdateOpts, requestConfig?: IRequestConfig) {
    return super._patchWithId<IResponse<IReportSchedule>, IReportScheduleUpdateOpts>(rpt_sch_id, opts, requestConfig);
  }

  /**
   * Deletes a Report Schedule. The schedule's status is set to inactive and no further reports will be generated.
   * https://docs.methodfi.com/reference/report-schedules/delete
   *
   * @param rpt_sch_id id of the Report Schedule
   * @returns Returns an empty response.
   */

  async delete(rpt_sch_id: string) {
    return super._delete<IResponse<IReportSchedule>>(rpt_sch_id);
  }
};

export default ReportSchedule;
export * from './types';
