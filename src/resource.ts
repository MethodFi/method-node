import axios, { AxiosInstance, AxiosResponse } from "axios";
import axios_retry from "axios-retry";
import Configuration, {
  IResponseEvent,
  TResponseEventIdemStatuses,
} from "./configuration";
import { MethodError } from "./errors";
import { AccountSubResources } from "./resources/Account";
import { PaymentSubResources } from "./resources/Payment";
import { EntitySubResources } from "./resources/Entity";
import { SimulateAccountsSubResources } from "./resources/Simulate/Accounts";

type TSubResources =
  | AccountSubResources
  | PaymentSubResources
  | EntitySubResources
  | SimulateAccountsSubResources;

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
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "User-Agent": this.getDefaultUserAgent(),
        "method-version": "2024-04-04",
      },
      httpsAgent: config.httpsAgent,
    });

    if (config.axiosRetryConfig) {
      axios_retry(this.client, config.axiosRetryConfig);
    }

    this.configureRequestInterceptors();
    this.configureResponseInterceptors();
  }

  private getDefaultUserAgent(): string {
    // @ts-ignore
    return `Method-Node/v${
      require(// @ts-ignore
      process.env.NODE_ENV === "TEST"
        ? "../../package.json"
        : "../package.json").version
    }`;
  }

  private configureRequestInterceptors(): void {
    this.client.interceptors.request.use((request) => {
      if (request.headers) request.headers["request-start-time"] = Date.now();

      if (this.config.onRequest) {
        this.config.onRequest({
          method: request?.method?.toUpperCase() as string,
          idempotency_key:
            (request?.headers?.["Idempotency-Key"] as string) || null,
          path: new URL(`${request.baseURL}${request.url}`).pathname,
          request_start_time: request?.headers?.[
            "request-start-time"
          ] as number,
        });
      }

      return request;
    });
  }

  private configureResponseInterceptors(): void {
    const extractResponseEvent = (response: AxiosResponse) => {
      const payload: IResponseEvent = {
        request_id: response.headers["idem-request-id"] || "",
        idempotency_status:
          (response.headers["idem-status"] as TResponseEventIdemStatuses) || "",
        method: response?.config?.method?.toUpperCase() || "",
        path:
          new URL(`${response.config.baseURL}${response.config.url}`)
            .pathname || "",
        status: response.status || 0,
        request_start_time: response?.config?.headers?.[
          "request-start-time"
        ] as number,
        request_end_time: Date.now(),
        pagination: {
          page: 1,
          page_count: 1,
          page_limit: 1,
          total_count: 1,
          page_cursor_next: "",
          page_cursor_prev: "",
        },
      };

      if (response.headers["pagination-page"])
        payload.pagination.page = Number(response.headers["pagination-page"]);
      if (response.headers["pagination-page-count"])
        payload.pagination.page_count = Number(
          response.headers["pagination-page-count"]
        );
      if (response.headers["pagination-page-limit"])
        payload.pagination.page_limit = Number(
          response.headers["pagination-page-limit"]
        );
      if (response.headers["pagination-total-count"])
        payload.pagination.total_count = Number(
          response.headers["pagination-total-count"]
        );
      if (response.headers["pagination-page-cursor-next"])
        payload.pagination.page_cursor_next =
          response.headers["pagination-page-cursor-next"];
      if (response.headers["pagination-page-cursor-prev"])
        payload.pagination.page_cursor_prev =
          response.headers["pagination-page-cursor-prev"];

      return payload;
    };

    this.client.interceptors.response.use(
      (response) => {
        const eventResponse = extractResponseEvent(response);
        if (this.config.onResponse)
          this.config.onResponse(eventResponse, response);

        // if (response.data.data == null) {
        //   if (typeof response.data === "string") {
        //     Object.defineProperty(String.prototype, "last_response", {
        //       get: function () {
        //         return eventResponse;
        //       },
        //     });
        //   } else {
        //     Object.defineProperty(response.data, "last_response", {
        //       enumerable: false,
        //       writable: false,
        //       value: eventResponse,
        //     });
        //   }
        // } else {
        //   Object.defineProperty(response.data.data, "last_response", {
        //     enumerable: false,
        //     writable: false,
        //     value: eventResponse,
        //   });
        // }

        // FIXME: add last_response to string type data (GET /reports/id/download)
        Object.defineProperty(
          response.data.data != null ? response.data.data : response.data,
          "last_response",
          {
            enumerable: false,
            writable: false,
            value: eventResponse,
          }
        );

        return response;
      },
      (error) => {
        if (this.config.onResponse && error.response) {
          this.config.onResponse(
            extractResponseEvent(error.response),
            error.response
          );
        }

        if (error.response && error.response.data && error.response.data.data)
          throw MethodError.generate(error.response.data.data.error);
        throw error;
      }
    );
  }

  protected _call(id: string): TSubResources {
    throw new Error();
  }

  protected async _getRaw<Response>(): Promise<Response> {
    return (await this.client.get("")).data;
  }

  protected async _get<Response>(): Promise<Response> {
    return (await this.client.get("")).data.data;
  }

  protected async _getWithId<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}`)).data.data;
  }

  protected async _getWithSubPath<Response>(path: string): Promise<Response> {
    return (await this.client.get(path)).data.data;
  }

  protected async _getWithParams<Response, Params = {}>(
    params: Params
  ): Promise<Response> {
    return (await this.client.get("", { params })).data.data;
  }

  protected async _getWithSubPathAndParams<Response, Params = {}>(
    path: string,
    params: Params
  ): Promise<Response> {
    return (await this.client.get(path, { params })).data.data;
  }

  protected async _list<Response, Params = {}>(
    params?: Params
  ): Promise<Response[]> {
    return (await this.client.get("", { params })).data.data;
  }

  protected async _create<Response, Data>(
    data: Data,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key)
      _requestConfig.headers = {
        "Idempotency-Key": requestConfig.idempotency_key,
      };
    return (await this.client.post("", data, _requestConfig)).data.data;
  }

  protected async _createWithSubPath<Response, Data>(
    path: string,
    data: Data,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key)
      _requestConfig.headers = {
        "Idempotency-Key": requestConfig.idempotency_key,
      };
    return (await this.client.post(path, data, _requestConfig)).data.data;
  }

  protected async _updateWithId<Response, Data>(
    id: string,
    data: Data,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key)
      _requestConfig.headers = {
        "Idempotency-Key": requestConfig.idempotency_key,
      };
    return (await this.client.put(`/${id}`, data, _requestConfig)).data.data;
  }

  protected async _update<Response, Data>(
    data: Data,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key)
      _requestConfig.headers = {
        "Idempotency-Key": requestConfig.idempotency_key,
      };
    return (await this.client.put("", data, _requestConfig)).data.data;
  }

  protected async _updateWithSubPath<Response, Data>(
    path: string,
    data: Data,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    const _requestConfig = { headers: {} };
    if (requestConfig.idempotency_key)
      _requestConfig.headers = {
        "Idempotency-Key": requestConfig.idempotency_key,
      };

    return (await this.client.put(path, data)).data.data;
  }

  protected async _delete<Response>(id: string): Promise<Response> {
    return (await this.client.delete(`/${id}`)).data.data;
  }

  protected async _deleteWithSubPath<Response>(
    path: string,
    requestConfig: IRequestConfig = {}
  ): Promise<Response> {
    return (await this.client.delete(path)).data.data;
  }

  protected async _download<Response>(id: string): Promise<Response> {
    return (await this.client.get(`/${id}/download`)).data;
  }

  protected async _postWithId<Response, Data>(
    id: string,
    data: Data
  ): Promise<Response> {
    return (await this.client.post(`/${id}`, data)).data.data;
  }
}

export interface IResourceError {
  type: string;
  code: number;
  sub_type: string;
  message: string;
}

export const ResourceStatus = {
  completed: "completed",
  in_progress: "in_progress",
  pending: "pending",
  failed: "failed",
} as const;

export type TResourceStatus = keyof typeof ResourceStatus;

export interface IResourceListOpts {
  from_date?: string | null;
  to_date?: string | null;
  page?: number | string | null;
  page_limit?: number | string | null;
  page_cursor?: string | null;
}
