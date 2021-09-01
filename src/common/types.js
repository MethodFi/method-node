// @flow
import { Axios } from 'axios';
import { IdempotencyStatuses } from './enums';


export type TIdempotencyStatuses = $Keys<typeof IdempotencyStatuses>;

export type TResourceOptions = {
  // $FlowFixMe
  axios_instance: Axios,
};

export type TResourceCreationConfig = {
  idempotency_key?: string,
};

export type TResourceCreationIdempotencyResponse = {
  idempotency_status?: TIdempotencyStatuses,
};
