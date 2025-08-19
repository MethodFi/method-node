import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import { IResourceError } from '../../resource';

export const CardProductTypes = {
  specific: 'specific',
  generic: 'generic',
  in_review: 'in_review',
} as const;

export type TCardProductTypes = keyof typeof CardProductTypes;

export interface ICardProductBrand {
  id: string;
  description: string;
  network: string;
  default_image: string;
}

export interface ICardProduct {
  id: string;
  name: string;
  issuer: string;
  type: TCardProductTypes;
  brands: ICardProductBrand[];
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export default class CardProduct extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('card_product'));
  }

  /**
   * Retrieves a card product by id
   * https://docs.methodfi.com/reference/card-products/retrieve
   *
   * @param pdt_id Method card product id
   * @returns ICardProduct
   */
  async retrieve(pdt_id: string) {
    return super._getWithId<IResponse<ICardProduct>>(pdt_id);
  }
}
