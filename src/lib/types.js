// @flow
import { Axios } from 'axios';

export type TResourceOptions = {
  // $FlowFixMe
  axios_instance: Axios,
};

export type TResourceCreationConfig = {
  // TODO: this
  idempotency_key?: string,
};
