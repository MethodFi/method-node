// @flow
import { WebhookTypes } from './enums';
import type { TResourceCreationIdempotencyResponse } from '../../common/types';


export type TWebhookTypes = $Keys<typeof WebhookTypes>;

export type TWebhookMetadata = { [string]: any };

export type TWebhookResponse = TResourceCreationIdempotencyResponse & {
  id: string,
  type: TWebhookTypes,
  url: string,
  metadata: ?TWebhookMetadata,
  created_at: string,
  updated_at: string,
};

export type TWebhookCreateOptions = {
  type: TWebhookTypes,
  url: string,
  auth_token?: string,
  metadata?: ?TWebhookMetadata,
};
