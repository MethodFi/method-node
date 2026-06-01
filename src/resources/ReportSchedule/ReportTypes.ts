import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { TReportTypes } from '../Report';
import type { IReportSchedule } from './types';

export interface IReportScheduleTypeAddOpts {
  type: TReportTypes;
};

export interface IReportScheduleTypesReplaceOpts {
  types: TReportTypes[];
};

export default class ReportScheduleTypes extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('types'));
  }

  /**
   * Adds a single Report type to an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/types/add
   *
   * @param opts IReportScheduleTypeAddOpts: { type: TReportTypes }
   * @returns Returns the updated Report Schedule object.
   */

  async add(opts: IReportScheduleTypeAddOpts) {
    return super._create<IResponse<IReportSchedule>, IReportScheduleTypeAddOpts>(opts);
  }

  /**
   * Replaces the full types array on an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/types/replace
   *
   * @param opts IReportScheduleTypesReplaceOpts: { types: TReportTypes[] }
   * @returns Returns the updated Report Schedule object.
   */

  async replace(opts: IReportScheduleTypesReplaceOpts) {
    return super._update<IResponse<IReportSchedule>, IReportScheduleTypesReplaceOpts>(opts);
  }

  /**
   * Removes a single Report type from an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/types/delete
   *
   * @param type The Report type to remove.
   * @returns Returns the updated Report Schedule object.
   */

  async delete(type: TReportTypes) {
    return super._deleteWithParams<IResponse<IReportSchedule>, { type: TReportTypes }>({ type });
  }
};
