import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEventListOpts, EventResourceTypes, IEventDiff } from './types';
import { TWebhookTypes } from '../Webhook';

export interface IEvent {
  id: string;
  type: TWebhookTypes;
  resource_id: string;
  resource_type: typeof EventResourceTypes[keyof typeof EventResourceTypes];
  data: Record<string, any>;
  diff: IEventDiff;
  updated_at: string;
  created_at: string;
}

export default class Event extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('events'));
  }

  /**
   * Retrieves an event by ID
   *
   * @param evt_id ID of the event
   * @returns Returns an Event object
   */
  async retrieve(evt_id: string) {
    return super._getWithId<IResponse<IEvent>>(evt_id);
  }

  /**
   * Lists all events, optionally filtered by resource_id
   *
   * @param opts IEventListOpts: https://docs.methodfi.com/api/core/events/list
   * @returns Returns a list of Event objects
   */
  async list(opts?: IEventListOpts) {
    return super._list<IResponse<IEvent>, IEventListOpts>(opts);
  }
}
