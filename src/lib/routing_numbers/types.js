// @flow
import {
  RoutingNumberOfficeTypes,
} from './enums';

export type TRoutingNumberOfficeTypes = $Keys<typeof RoutingNumberOfficeTypes>;

export type TRoutingNumberAddress = {
  line1: string;
  line2: ?string;
  city: string;
  state: string;
  zip: string;
};

export type TRoutingNumberResponse = {
  id: string,
  institution_name: string,
  routing_number: string,
  logo: string,
  office_type: TRoutingNumberOfficeTypes,
  change_date: string,
  address: TRoutingNumberAddress,
  phone: ?string,
};
