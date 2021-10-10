import Resource from '../../resource';
import Configuration from '../../configuration';

export const RoutingNumberOfficeTypes = {
  main: 'main',
  branch: 'branch',
}

export type TRoutingNumberOfficeTypes =
  | 'main'
  | 'branch';

export interface IRoutingNumberAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
}

export interface IRoutingNumber {
  id: string;
  institution_name: string;
  routing_number: string;
  logo: string;
  office_type: TRoutingNumberOfficeTypes;
  change_date: string;
  address: IRoutingNumberAddress;
  phone: string | null;
}

export default class RoutingNumber extends Resource {
  constructor(config: Configuration) {
    super('/routing_numbers', config);
  }

  async get(routing_number: string) {
    return super._getWithParams<IRoutingNumber, { routing_number: string }>({ routing_number });
  }
};
