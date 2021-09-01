// @flow
import type { TResourceCreationIdempotencyResponse } from '../../common/types';


export type TResourceErrorOptions = TResourceCreationIdempotencyResponse & {
  type: string,
  sub_type: string,
  message: string,
  code: number,
};
