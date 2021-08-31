// @flow
import {
  MerchantTypes,
} from './enums';


export type TMerchantTypes = $Keys<typeof MerchantTypes>;

export type TMerchantProviderIds = {
  plaid: Array<string>,
  mx: Array<string>,
  finicity: Array<string>,
};

export type TMerchantResponse = {
  mch_id: string,
  parent_name: string,
  name: string,
  logo: string,
  description: ?string,
  note: ?string,
  types: Array<TMerchantTypes>,
  account_prefixes: Array<string>,
  provider_ids: TMerchantProviderIds,
};

export type TMerchantListOptions = {
  name?: string,
  'provider_id.plaid'?: string,
  'provider_id.mx'?: string,
  'provider_id.finicity'?: string,
};
