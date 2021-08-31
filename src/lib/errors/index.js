// @flow
import type { TResourceErrorOptions } from './types';

export class ResourceError {
  type: string;
  sub_type: string;
  message: string;

  constructor(opts: TResourceErrorOptions) {
    this.type = opts.type;
    this.sub_type = opts.sub_type;
    this.message = opts.message;
  }
}
