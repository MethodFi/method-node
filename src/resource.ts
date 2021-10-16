import axios, { AxiosInstance } from 'axios';
import Configuration from './configuration';
import { MethodError } from './errors';


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
    // TODO:
  }

  private configureResponseInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
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

  protected async _get<Response>(): Promise<Response> {
    return (await this.client.get('')).data.data;
  }

  protected async _getWithId<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}`)).data.data;
  }

  protected async _getWithParams<Response, Params = {}>(params: Params): Promise<Response> {
    return (await this.client.get('', { params })).data.data;
  }

  protected async _list<Response, Params = {}>(params?: Params): Promise<Response[]> {
    return (await this.client.get('', { params })).data.data;
  }

  protected async _create<Response, Data>(data: Data): Promise<Response> {
    return (await this.client.post('', data)).data.data;
  }

  protected async _createWithSubPath<Response, Data>(path: string, data: Data): Promise<Response> {
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
    return (await this.client.get(`/${id}`)).data;
  }
}
