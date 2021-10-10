import { should } from 'chai';
import { MethodClient, Environments, BINBrands } from '../../src/method';
import { IBIN } from '../../src/resources/Bin';

should();

const client = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('BINs - core methods tests', () => {
  let bins_get_response: IBIN | null = null;
  const amex_platinum_bin = '371307';

  describe('bins.get', () => {
    it('should successfully get a bin.', async () => {
      bins_get_response = await client.bins.get(amex_platinum_bin);

      (bins_get_response !== null).should.be.true;
      bins_get_response.brand.should.equal(BINBrands.amex);
    });
  });
});
