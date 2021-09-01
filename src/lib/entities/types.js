// @flow
import {
  EntityIndividualTypes,
  EntityCorporationTypes,
  EntityReceiveOnlyTypes,
  EntityCapabilities,
  EntityStatuses,
} from './enums';
import type { TResourceCreationIdempotencyResponse } from '../../common/types';

export type TEntityIndividualTypes = $Keys<typeof EntityIndividualTypes>;

export type TEntityCorporationTypes = $Keys<typeof EntityCorporationTypes>;

export type TEntityReceiveOnlyTypes = $Keys<typeof EntityReceiveOnlyTypes>;

export type TEntityTypes = TEntityIndividualTypes | TEntityCorporationTypes | TEntityReceiveOnlyTypes;

export type TEntityCapabilities = $Keys<typeof EntityCapabilities>;

export type TEntityStatuses = $Keys<typeof EntityStatuses>;

export type TEntityMetadata = { [string]: any };

export type TEntityIndividual = {
  first_name: ?string,
  last_name: ?string,
  phone: ?string,
  email: ?string,
  dob: ?string,
};

export type TEntityAddress = {
  line1: ?string,
  line2: ?string,
  city: ?string,
  state: ?string,
  zip: ?string,
};

export type TEntityCorporationOwner = {
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  dob: string,
  address: TEntityAddress,
};

export type TEntityCorporation = {
  name: ?string,
  dba: ?string,
  ein: ?string,
  owners: Array<TEntityCorporationOwner>,
};

export type TEntityReceiveOnly = {
  name: string,
  phone: ?string,
  email: ?string,
};

export type TEntityResponse = TResourceCreationIdempotencyResponse & {
  id: string,
  type: TEntityTypes,
  individual: ?TEntityIndividual,
  corporation: ?TEntityCorporation,
  receive_only: ?TEntityReceiveOnly,
  capabilities: Array<TEntityCapabilities>,
  address: TEntityAddress,
  status: TEntityStatuses,
  metadata: ?TEntityMetadata,
  created_at: string,
  updated_at: string,
};

export type TEntityCreateIndividualOptions = {
  type: TEntityIndividualTypes,
  individual: TEntityIndividual,
  address?: TEntityAddress,
  metadata?: TEntityMetadata,
};

export type TEntityCreateCorporationOptions = {
  type: TEntityCorporationTypes,
  corporation: TEntityCorporation,
  address?: TEntityAddress,
  metadata?: TEntityMetadata,
};

export type TEntityCreateOptions = TEntityCreateIndividualOptions | TEntityCreateCorporationOptions;

export type TEntityUpdateIndividualOptions = {
  individual: TEntityIndividual,
  address?: TEntityAddress,
};

export type TEntityUpdateCorporationOptions = {
  corporation: TEntityCorporation,
  address?: TEntityAddress,
};

export type TEntityUpdateOptions = TEntityUpdateIndividualOptions | TEntityUpdateCorporationOptions;
