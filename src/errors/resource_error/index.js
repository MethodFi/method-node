// @flow
import type { TResourceErrorOptions } from './types';
import type { TIdempotencyStatuses } from '../../common/types';

export default class ResourceError extends Error {
  type: string;
  sub_type: string;
  message: string;
  code: number;
  idempotency_status: TIdempotencyStatuses;
  idempotency_key: string;

  constructor(opts: TResourceErrorOptions) {
    super();

    this.type = opts.type;
    this.sub_type = opts.sub_type;
    this.message = opts.message;
    this.code = opts.code;
    if (opts.idempotency_status) this.idempotency_status = opts.idempotency_status;
    if (opts.idempotency_key) this.idempotency_key = opts.idempotency_key;
    Error.captureStackTrace(this, this.constructor);
  }
}
