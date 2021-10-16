import { should } from 'chai';
import { MethodClient, Environments } from '../../src';
import { IRoutingNumber } from '../../src/resources/RoutingNumber';

should();

const client = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('RoutingNumbers - core methods tests', () => {
  const capital_one_routing_number = '031176110';
  let routing_number_get_response: IRoutingNumber | null = null;

  describe('routingNumbers.get', () => {
    it('should successfully get a routing_number.', async () => {
      routing_number_get_response = await client.routingNumbers.get(capital_one_routing_number);

      (routing_number_get_response !== null).should.be.true;
    });
  });
});
