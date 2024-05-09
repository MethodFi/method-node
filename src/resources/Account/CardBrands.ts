import Resource, { IResourceError } from '../../resource';
import Configuration from '../../configuration';

export interface IAccountCardBrandInfo {
  art_id: string;
  url: string;
  name: string;
};

export interface IAccountCardBrand {
  id: string;
  account_id: string;
  network: string;
  issuer: string;
  last4: string;
  brands: IAccountCardBrandInfo[];
  status: 'completed' | 'failed';
  shared: boolean;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class AccountCardBrand extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_brands'));
  }

  /**
   * Creates a Card request for a credit card Account.
   * 
   * @returns Returns a Card object.
   */

  async create() {
    return super._create<IAccountCardBrand, {}>({});
  }

  /**
   * Retrieves a Card object.
   * 
   * @param crd_id ID of the Card
   * @returns Returns a Card object.
   */

  async retrieve(crd_id: string) {
    return super._getWithId<IAccountCardBrand>(crd_id);
  }
};
