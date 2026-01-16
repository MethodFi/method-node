import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IWebhook, IWebhookCreateOpts, IWebhookUpdateOpts } from './types';

export default class Webhook extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('webhooks'));
  }

  /**
   * Returns the webhook associated with the id.
   *
   * @param whk_id ID of the webhook
   * @returns Returns the Webhook associated with the ID.
   */

  async retrieve(whk_id: string) {
    return super._getWithId<IResponse<IWebhook>>(whk_id);
  }

  /**
   * Returns all the webhook associated with your team, or an empty array is none have been created.
   *
   * @returns Returns a list of Webhook objects.
   */

  async list() {
    return super._list<IResponse<IWebhook>>();
  }

  /**
   * Creating a new Webhook means registering a URL to receive updates for a specific event type.
   * Once a resource is created or updated, your application will be notified via an HTTP POST request with the event information.
   *
   * @param opts IWebhookCreateOpts: https://docs.methodfi.com/reference/webhooks/create
   * @param requestConfig Idempotency key: { idempotency_key: string}
   * @returns Returns the newly created Webhook object.
   */

  async create(opts: IWebhookCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IWebhook>, IWebhookCreateOpts>(opts, requestConfig);
  }

  /**
   * Updates the status of the webhook associated with the id.
   *
   * @param whk_id id of the webhook
   * @param opts IWebhookUpdateOpts: https://docs.methodfi.com/api/core/webhooks/update
   * @returns Returns the updated Webhook object.
   */

  async update(whk_id: string, opts: IWebhookUpdateOpts) {
    return super._patchWithId<IResponse<IWebhook>, IWebhookUpdateOpts>(whk_id, opts);
  }

  /**
   * Deletes the webhook associated with the id.
   *
   * @param whk_id id of the webhook
   * @returns Returns 200 with an empty object on success.
   */

  async delete(whk_id: string) {
    return super._delete<IResponse<{}>>(whk_id);
  }
};

export * from './types';
