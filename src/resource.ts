import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Configuration, { TResponseEventIdemStatuses } from './configuration';
import { MethodError } from './errors';
import { AccountSubResources } from './resources/Account';
import { PaymentSubResources } from './resources/Payment';
import { EntitySubResources } from './resources/Entity';
import axios_retry from 'axios-retry';

type TSubResources = AccountSubResources | PaymentSubResources | EntitySubResources;

export interface IRequestConfig {
  idempotency_key?: string;
}

class ExtensibleFunction extends Function {
  // @ts-ignore
  constructor(f) {
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}

export default class Resource extends ExtensibleFunction {
  private client: AxiosInstance;
  protected config: Configuration;

  constructor(config: Configuration) {
    super((id: string) => this._call(id));
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: { Authorization: `Bearer ${config.apiKey}`, 'User-Agent': this.getDefaultUserAgent() },
      httpsAgent: config.httpsAgent,
    });

    if (config.axiosRetryConfig) {
      axios_retry(this.client, config.axiosRetryConfig);
    }

    this.configureRequestInterceptors();
    this.configureResponseInterceptors();
  }

  private getDefaultUserAgent(): string {
    return `Method-Node/v${require(
      process.env.NODE_ENV === 'TEST' ? '../../package.json' : '../package.json'
    ).version}`;
  }

  private configureRequestInterceptors(): void {
    this.client.interceptors.request.use((request) => {
      request.headers['request-start-time'] = Date.now();

      if (this.config.onRequest) {
        this.config.onRequest({
          method: request.method.toUpperCase(),
          idempotency_key: request.headers['Idempotency-Key'] as string || null,
          path: new URL(`${request.baseURL}${request.url}`).pathname,
          request_start_time: request.headers['request-start-time'] as number,
        });
      }

      return request;
    });
  }

  private configureResponseInterceptors(): void {
    const extractResponseEvent = (response: AxiosResponse) => {
      const payload = {
        request_id: response.headers['idem-request-id'] || null,
        idempotency_status: response.headers['idem-status'] as TResponseEventIdemStatuses || null,
        method: response.config.method.toUpperCase(),
        path: new URL(`${response.config.baseURL}${response.config.url}`).pathname,
        status: response.status,
        request_start_time: response.config.headers['request-start-time'] as number,
        request_end_time: Date.now(),
        pagination: {
          page: 1,
          page_count: 1,
          page_limit: 1,
          total_count: 1,
          page_cursor_next: null,
          page_cursor_prev: null,
        },
      };

      if (response.headers['pagination-page']) payload.pagination.page = Number(response.headers['pagination-page']);
      if (response.headers['pagination-page-count']) payload.pagination.page_count = Number(response.headers['pagination-page-count']);
      if (response.headers['pagination-page-limit']) payload.pagination.page_limit = Number(response.headers['pagination-page-limit']);
      if (response.headers['pagination-total-count']) payload.pagination.total_count = Number(response.headers['pagination-total-count']);
      if (response.headers['pagination-page-cursor-next']) payload.pagination.page_cursor_next = response.headers['pagination-page-cursor-next'];
      if (response.headers['pagination-page-cursor-prev']) payload.pagination.page_cursor_prev = response.headers['pagination-page-cursor-prev'];

      return payload;
    };

    this.client.interceptors.response.use(
      (response) => {
        if (this.config.onResponse) this.config.onResponse(extractResponseEvent(response), response);

        return response;
      },
      (error) => {
        if (this.config.onResponse && error.response) {
          this.config.onResponse(extractResponseEvent(error.response), error.response);
        }

        if (error.response
          && error.response.data
          && error.response.data.data) throw MethodError.generate(error.response.data.data.error);
        throw error;
      },
    );
  }

  protected _call(id: string): TSubResources {
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

  protected async _updateWithSubPath<Response, Data>(
    path: string,
    data: Data,
    requestConfig: IRequestConfig = {},
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key) _requestConfig.headers = { 'Idempotency-Key': requestConfig.idempotency_key };

    return (await this.client.put(path, data)).data.data;
  }

  protected async _delete<Response>(id: string): Promise<Response> {
    return (await this.client.delete(`/${id}`)).data.data;
  }

  protected async _deleteWithSubPath<Response, Data>(
    path: string,
    data: Data,
    requestConfig: IRequestConfig = {},
  ): Promise<Response> {
    return (await this.client.delete(path, data)).data.data;
  }

  protected async _download<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}/download`)).data;
  }

  protected async _postWithId<Response, Data>(id: string, data: Data): Promise<Response> {
    return (await this.client.post(`/${id}`, data)).data.data;
  }
}

export interface IResourceError {
  type: string;
  code: number;
  sub_type: string;
  message: string;
}
