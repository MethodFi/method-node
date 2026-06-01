import type { TReportTypes } from '../Report';

export const ReportScheduleStatuses = {
  active: 'active',
  inactive: 'inactive',
} as const;

export type TReportScheduleStatuses = keyof typeof ReportScheduleStatuses;

export const ReportScheduleDeliveryMethodTypes = {
  webhook: 'webhook',
  email: 'email',
} as const;

export type TReportScheduleDeliveryMethodTypes = typeof ReportScheduleDeliveryMethodTypes[keyof typeof ReportScheduleDeliveryMethodTypes];

export interface IReportSchedule {
  id: string;
  types: TReportTypes[];
  delivery_methods: TReportScheduleDeliveryMethodTypes[];
  recipients: string[] | null;
  cron: string;
  status: TReportScheduleStatuses;
  created_at: string;
  updated_at: string;
};

export interface IReportScheduleCreateOpts {
  types: TReportTypes[];
  delivery_methods: TReportScheduleDeliveryMethodTypes[];
  recipients?: string[];
  cron?: string;
};

export interface IReportScheduleUpdateOpts {
  cron: string;
};
