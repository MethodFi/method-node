// @flow
import { BINBrands, BINTypes } from './enums';

export type TBINBrands = $Keys<typeof BINBrands>;

export type TBINTypes = $Keys<typeof BINTypes>;

export type TBINResponse = {
  id: ?string,
  bin: ?string,
  brand: TBINBrands,
  issuer: ?string,
  type: ?TBINTypes,
  category: ?string,
  bank_url: ?string,
  sample_pan: ?string,
};
