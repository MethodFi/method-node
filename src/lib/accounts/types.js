// @flow
import { AccountACHTypes, AccountLiabilityTypes, AccountACHSubTypes } from './enums';
import type { TResourceCreationIdempotencyResponse } from '../../common/types';

export type TAccountMetadata = { [string]: any };

export type TAccountACHTypes = $Keys<typeof AccountACHTypes>;

export type TAccountLiabilityTypes = $Keys<typeof AccountLiabilityTypes>;

export type TAccountACHSubTypes = $Keys<typeof AccountACHSubTypes>;

export type TAccountTypes = TAccountACHTypes | TAccountLiabilityTypes;

export type TAccountACH = {
  routing: string,
  number: string,
  type: TAccountACHSubTypes,
};

export type TAccountLiability = {
  mch_id: string,
  mask: ?string,
};

export type TAccountResponse = TResourceCreationIdempotencyResponse & {
  id: string,
  holder_id: string,
  type: TAccountTypes,
  ach: ?TAccountACH,
  liability: ?TAccountLiability,
  metadata: ?TAccountMetadata,
  created_at: string,
  updated_at: string,
};

export type TAccountCreateACHOptions = {
  holder_id: string,
  ach: TAccountACH,
};

export type TAccountCreateLiabilityOptions = {
  holder_id: string,
  liability: {
    mch_id: string,
    account_number: string,
  },
};

export type TAccountCreateOptions = TAccountCreateACHOptions | TAccountCreateLiabilityOptions;

export type TAccountListOptions = {
  holder_id?: string,
  type?: TAccountTypes,
};
