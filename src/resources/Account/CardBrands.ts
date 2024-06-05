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
  network: string | null;
  issuer: string | null;
  last4: string | null;
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
   * Retrieves a Card Brand object.
   * 
   * @param cbrd_id ID of the Card
   * @returns Returns a Card object.
   */

  async retrieve(cbrd_id: string) {
    return super._getWithId<IAccountCardBrand>(cbrd_id);
  }
  
  /**
   * Creates a new CardBrand request to retrieve the Account’s card brand.
   * 
   * @returns Returns a Card object.
   */

  async create() {
    return super._create<IAccountCardBrand, {}>({});
  }
};
