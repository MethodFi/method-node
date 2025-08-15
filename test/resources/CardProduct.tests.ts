import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { ICardProduct } from '../../src/resources/CardProduct';
import { IResponse } from '../../src/configuration';

should();

describe('Card Products - core methods tests', () => {
  let card_products_retrieve_response: IResponse<ICardProduct>;

  describe('cardProducts.retrieve', () => {
    it('should successfully retrieve a card product by id.', async () => {
      card_products_retrieve_response = await client.cardProducts.retrieve('pdt_15');
      
      const expect_results: ICardProduct = {
        id: "pdt_17",
        name: "Chase Freedom",
        issuer: "Chase",
        type: "specific",
        brands: [
          {
              id: "pdt_17_brd_1",
              description: "Chase Freedom",
              network: "visa",
              default_image: "https://static.methodfi.com/card_brands/fb5fbd6a5d45b942752b9dc641b93d1f.png"
          },
          {
              id: "pdt_17_brd_2",
              description: "Chase Freedom",
              network: "visa",
              default_image: "https://static.methodfi.com/card_brands/6cb697528b0771f982f7c0e8b8869de3.png"
          }
        ],
        error: null,
        created_at: card_products_retrieve_response.created_at,
        updated_at: card_products_retrieve_response.updated_at,
      }

      card_products_retrieve_response.should.be.eql(expect_results);
    });
  });
});
