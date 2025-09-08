import Resource from '../../resource';
import Configuration from '../../configuration';
import type { TWebhookTypes } from '../Webhook/types';

export interface ISimulateEventsOpts {
  type: TWebhookTypes;
  entity_id?: string;
  account_id?: string;
};

export default class SimulateEvents extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('events'));
  }

  /**
   * Simulates an event.
   *
   * @param data The event type and optional entity or account ID.
   * @returns null
   */

  async create(data: ISimulateEventsOpts) {
    return super._create<{}, ISimulateEventsOpts>(data);
  }
};
