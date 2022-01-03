import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Configuration from './configuration';
import { MethodError } from './errors';

export interface IRequestConfig {
  idempotency_key?: string;
}

class ExtensibleFunction<T> extends Function {
  // @ts-ignore
  constructor(f): T {
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}

export default class Resource<SubResources> extends ExtensibleFunction<SubResources> {
  private client: AxiosInstance;
  protected config: Configuration;

  constructor(config: Configuration) {
    super((id: string): SubResources => this._call<SubResources>(id));
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });

    this.configureRequestInterceptors();
    this.configureResponseInterceptors();
  }

  private configureRequestInterceptors(): void {
    this.client.interceptors.request.use((request) => {
      request.headers['request-start-time'] = Date.now();

      if (this.config.onRequest) {
        this.config.onRequest({
          method: request.method.toUpperCase(),
          idempotency_key: request.headers['Idempotency-Key'] || null,
          path: new URL(`${request.baseURL}${request.url}`).pathname,
          request_start_time: request.headers['request-start-time'],
        });
      }

      return request;
    });
  }

  private configureResponseInterceptors(): void {
    const extractResponseEvent = (response: AxiosResponse) => ({
      request_id: response.headers['idem-request-id'] || null,
      idempotency_status: response.headers['idem-status'] || null,
      method: response.config.method.toUpperCase(),
      path: new URL(`${response.config.baseURL}${response.config.url}`).pathname,
      status: response.status,
      request_start_time: response.config.headers['request-start-time'],
      request_end_time: Date.now(),
    });

    this.client.interceptors.response.use(
      (response) => {
        if (this.config.onResponse) this.config.onResponse(extractResponseEvent(response));

        return response;
      },
      (error) => {
        if (this.config.onResponse && error.response) this.config.onResponse(extractResponseEvent(error.response));

        if (error.response
          && error.response.data
          && error.response.data.data) throw MethodError.generate(error.response.data.data.error);
        throw error;
      },
    );
  }

  private _call<SubResources>(id: string): SubResources {
    throw new Error();
  }

  protected async _getRaw<Response>(): Promise<Response> {
    return (await this.client.get('')).data;
  }

  protected async _get<Response>(): Promise<Response> {
    return (await this.client.get('')).data.data;
  }

  protected async _getWithId<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}`)).data.data;
  }

  protected async _getWithSubPath<Response>(path: string): Promise<Response> {
    return (await this.client.get(path)).data.data;
  }

  protected async _getWithParams<Response, Params = {}>(params: Params): Promise<Response> {
    return (await this.client.get('', { params })).data.data;
  }

  protected async _list<Response, Params = {}>(params?: Params): Promise<Response[]> {
    return (await this.client.get('', { params })).data.data;
  }

  protected async _create<Response, Data>(
    data: Data,
    requestConfig: IRequestConfig = {},
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key) _requestConfig.headers = { 'Idempotency-Key': requestConfig.idempotency_key };

    return (await this.client.post('', data, _requestConfig)).data.data;
  }

  protected async _createWithSubPath<Response, Data>(
    path: string,
    data: Data,
    requestConfig: IRequestConfig = {},
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key) _requestConfig.headers = { 'Idempotency-Key': requestConfig.idempotency_key };

    return (await this.client.post(path, data)).data.data;
  }

  protected async _updateWithId<Response, Data>(id: string, data: Data): Promise<Response> {
    return (await this.client.put(`/${id}`, data)).data.data;
  }

  protected async _update<Response, Data>(data: Data): Promise<Response> {
    return (await this.client.put('', data)).data.data;
  }

  protected async _delete<Response>(id: string): Promise<Response> {
    return (await this.client.delete(`/${id}`)).data.data;
  }

  protected async _download<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}/download`)).data;
  }
}

export interface IResourceError {
  type: string;
  code: number;
  sub_type: string;
  message: string;
}
