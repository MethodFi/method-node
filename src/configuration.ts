type TEnvironments =
  | 'production'
  | 'sandbox'
  | 'dev';

type EnvironmentsMapped = { [key in TEnvironments]: key };

export const Environments: EnvironmentsMapped = {
   production: 'production',
   sandbox: 'sandbox',
   dev: 'dev',
}

export interface IRequestEvent {
  idempotency_key: string | null;
  method: string;
  path: string;
  request_start_time: number;
}

export type TResponseEventIdemStatuses =
  | 'stored'
  | 'bypassed'
  | 'replayed';

export interface IResponseEvent {
  request_id: string | null;
  idempotency_status: TResponseEventIdemStatuses | null;
  method: string;
  path: string;
  status: number;
  request_start_time: number;
  request_end_time: number;
}

export type TOnRequest = (event: IRequestEvent) => void;

export type TOnResponse = (event: IResponseEvent) => void;

export interface IConfigurationOpts {
  apiKey: string;
  env: TEnvironments;
  onRequest?: TOnRequest;
  onResponse?: TOnResponse;
}

export default class Configuration {
  baseURL: string;
  apiKey: string;
  onResponse: TOnResponse | null;
  onRequest: TOnRequest | null;

  constructor(opts: IConfigurationOpts) {
    Configuration._validateConfiguration(opts);

    this.baseURL = `https://${opts.env}.methodfi.com`;
    this.apiKey = opts.apiKey;
    this.onRequest = opts.onRequest || null;
    this.onResponse = opts.onResponse || null;
  }

  public addPath(path: string): Configuration {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    clone.baseURL = `${clone.baseURL}/${path}`;

    return clone;
  }

  private static _validateConfiguration(opts: IConfigurationOpts): void {
    if (!Environments[opts.env]) throw new Error(`Invalid env: ${opts.env}`);
    if (!opts.apiKey) throw new Error(`Invalid apiKey: ${opts.apiKey}`);
  }
}
