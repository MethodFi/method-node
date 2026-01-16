import { AxiosResponse } from 'axios';

export const Environments = {
  production: 'production',
  sandbox: 'sandbox',
  dev: 'dev',
} as const;

export type TEnvironments = keyof typeof Environments

export interface IRequestEvent {
  idempotency_key: string | null;
  method: string;
  path: string;
  request_start_time: number;
};

export type TResponseEventIdemStatuses =
  | 'stored'
  | 'bypassed'
  | 'replayed';

export interface IResponseEventPagination {
  page: number;
  page_limit: number;
  page_count: number;
  total_count: number;
  page_cursor_next: string | null;
  page_cursor_prev: string | null;
};

export interface IResponseEvent {
  request_id: string | null;
  idempotency_status: TResponseEventIdemStatuses | null;
  method: string;
  path: string;
  status: number;
  request_start_time: number;
  request_end_time: number;
  pagination: IResponseEventPagination,
};

export type IResponse<T> = T & {
  last_response: IResponseEvent;
};

export type TOnRequest = (event: IRequestEvent) => void;

export type TOnResponse = (event: IResponseEvent, axios_response: AxiosResponse) => void;

export type IAxiosRetryConfig = {
  retries?: number;
  shouldResetTimeout?: boolean;
  retryDelay?: (retryCount: number) => number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any) => void;
};

export interface IConfigurationOpts {
  apiKey: string;
  env: TEnvironments;
  httpsAgent?: any;
  onRequest?: TOnRequest;
  onResponse?: TOnResponse;
  axiosRetryConfig?: IAxiosRetryConfig;
  baseURL?: string;
};

export default class Configuration {
  baseURL: string;
  apiKey: string;
  httpsAgent?: any;
  onResponse: TOnResponse | null;
  onRequest: TOnRequest | null;
  axiosRetryConfig?: IAxiosRetryConfig | null;

  constructor(opts: IConfigurationOpts) {
    Configuration._validateConfiguration(opts);

    this.baseURL = opts.baseURL || `https://${opts.env}.methodfi.com`;
    this.apiKey = opts.apiKey;
    this.httpsAgent = opts.httpsAgent || null;
    this.onRequest = opts.onRequest || null;
    this.onResponse = opts.onResponse || null;
    this.axiosRetryConfig = opts.axiosRetryConfig || null;
  }

  public addPath(path: string): Configuration {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    clone.baseURL = `${clone.baseURL}/${path}`;

    return clone;
  }

  private static _validateConfiguration(opts: IConfigurationOpts): void {
    if (!Environments[opts.env]) throw new Error(`Invalid env: ${opts.env}`);
    if (!opts.apiKey) throw new Error(`Invalid apiKey: ${opts.apiKey}`);
  }
};
