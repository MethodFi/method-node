import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IReportSchedule } from './types';

export interface IReportScheduleRecipientAddOpts {
  recipient: string;
};

export interface IReportScheduleRecipientsReplaceOpts {
  recipients: string[];
};

export default class ReportScheduleRecipients extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('recipients'));
  }

  /**
   * Adds a single recipient email address to an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/recipients/add
   *
   * @param opts IReportScheduleRecipientAddOpts: { recipient: string }
   * @returns Returns the updated Report Schedule object.
   */

  async add(opts: IReportScheduleRecipientAddOpts) {
    return super._create<IResponse<IReportSchedule>, IReportScheduleRecipientAddOpts>(opts);
  }

  /**
   * Replaces the full recipients array on an existing Report Schedule.
   * https://docs.methodfi.com/reference/report-schedules/recipients/replace
   *
   * @param opts IReportScheduleRecipientsReplaceOpts: { recipients: string[] }
   * @returns Returns the updated Report Schedule object.
   */

  async replace(opts: IReportScheduleRecipientsReplaceOpts) {
    return super._update<IResponse<IReportSchedule>, IReportScheduleRecipientsReplaceOpts>(opts);
  }

  /**
   * Removes a recipient from an existing Report Schedule. Provide a recipient to
   * remove a single email address, or omit it to clear all recipients.
   * https://docs.methodfi.com/reference/report-schedules/recipients/delete
   *
   * @param recipient The email address to remove. If omitted, all recipients are cleared.
   * @returns Returns the updated Report Schedule object.
   */

  async delete(recipient?: string) {
    return super._deleteWithParams<IResponse<IReportSchedule>, { recipient?: string }>(
      recipient ? { recipient } : {},
    );
  }
};
