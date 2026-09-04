import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';

export const ForwardingRequestStatuses = {
  completed: 'completed',
  failed: 'failed',
} as const;

export type TForwardingRequestStatuses = keyof typeof ForwardingRequestStatuses;

export const ForwardingRequestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type TForwardingRequestMethods = keyof typeof ForwardingRequestMethods;

export interface IForwardingRequestDetail {
  url: string;
  method: TForwardingRequestMethods;
  headers: Record<string, string>;
  body: string;
};

export interface IForwardingResponseDetail {
  status_code: number | null;
  headers: Record<string, string>;
  body: any | null;
};

export interface IForwardingRequest {
  id: string;
  bindings: Record<string, string>;
  request: IForwardingRequestDetail;
  response: IForwardingResponseDetail;
  duration_ms: number;
  status: TForwardingRequestStatuses;
  status_history: { status: string; message: string | null; }[];
  created_at: string;
};

export interface IForwardingRequestCreateOpts {
  url: string;
  method: TForwardingRequestMethods;
  headers: Record<string, string>;
  body: string;
  bindings: Record<string, string>;
  metadata?: {} | null;
};

export default class ForwardingRequest extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('forwarding_requests'));
  }

  async retrieve(freq_id: string) {
    return super._getWithId<IResponse<IForwardingRequest>>(freq_id);
  }

  async create(opts: IForwardingRequestCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IForwardingRequest>, IForwardingRequestCreateOpts>(opts, undefined, requestConfig);
  }
};
