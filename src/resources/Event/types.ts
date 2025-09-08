import { IResourceListOpts } from '../../resource';
import type { TWebhookTypes } from '../Webhook/types';

export const EventResourceTypes = {
  account: 'account',
  credit_score: 'credit_score',
  attribute: 'attribute',
  connect: 'connect',
} as const;

export interface IEventDiff {
  before: Record<string, any> | null;
  after: Record<string, any> | null;
}

export interface IEventListOpts extends IResourceListOpts {
  resource_id?: string;
  resource_type?: typeof EventResourceTypes[keyof typeof EventResourceTypes];
  type?: TWebhookTypes;
}
