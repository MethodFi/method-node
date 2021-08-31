// @flow
import {
  ReportTypes,
  ReportStatuses,
} from './enums';


export type TReportTypes = $Keys<typeof ReportTypes>;

export type TReportStatuses = $Keys<typeof ReportStatuses>;

export type TReportMetadata = { [string]: any };

export type TReportResponse = {
  id: string,
  type: TReportTypes,
  url: string,
  status: TReportStatuses,
  metadata: ?TReportMetadata,
  created_at: string,
  updated_at: string,
};

export type TReportCreateOptions = {
  type: TReportTypes,
  metadata?: TReportMetadata,
};
