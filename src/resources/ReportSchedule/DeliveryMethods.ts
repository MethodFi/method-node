import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IReportSchedule, TReportScheduleDeliveryMethodTypes } from './types';

export interface IReportScheduleDeliveryMethodAddOpts {
  delivery_method: TReportScheduleDeliveryMethodTypes;
};

export interface IReportScheduleDeliveryMethodsReplaceOpts {
  delivery_methods: TReportScheduleDeliveryMethodTypes[];
};

export default class ReportScheduleDeliveryMethods extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('delivery_methods'));
  }

  /**
   * Adds a single delivery method to an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/delivery-methods/add
   *
   * @param opts IReportScheduleDeliveryMethodAddOpts: { delivery_method: TReportScheduleDeliveryMethodTypes }
   * @returns Returns the updated Report Schedule object.
   */

  async add(opts: IReportScheduleDeliveryMethodAddOpts) {
    return super._create<IResponse<IReportSchedule>, IReportScheduleDeliveryMethodAddOpts>(opts);
  }

  /**
   * Replaces the full delivery_methods array on an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/delivery-methods/replace
   *
   * @param opts IReportScheduleDeliveryMethodsReplaceOpts: { delivery_methods: TReportScheduleDeliveryMethodTypes[] }
   * @returns Returns the updated Report Schedule object.
   */

  async replace(opts: IReportScheduleDeliveryMethodsReplaceOpts) {
    return super._update<IResponse<IReportSchedule>, IReportScheduleDeliveryMethodsReplaceOpts>(opts);
  }

  /**
   * Removes a single delivery method from an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/delivery-methods/delete
   *
   * @param delivery_method The delivery method to remove.
   * @returns Returns the updated Report Schedule object.
   */

  async delete(delivery_method: TReportScheduleDeliveryMethodTypes) {
    return super._deleteWithParams<IResponse<IReportSchedule>, { delivery_method: TReportScheduleDeliveryMethodTypes }>({ delivery_method });
  }
};
