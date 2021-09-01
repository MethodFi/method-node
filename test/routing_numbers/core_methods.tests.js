/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient, Environments } from '../../src';
import type { TRoutingNumberResponse } from '../../src/lib/routing_numbers/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('RoutingNumbers - core methods tests', () => {
  const capital_one_routing_number = '031176110';
  let routing_number_get_response: ?TRoutingNumberResponse = null;

  describe('routingNumbers.get', () => {
    it('should successfully get a routing_number.', async () => {
      routing_number_get_response = await client.routingNumbers.get(capital_one_routing_number);

      (routing_number_get_response !== null).should.be.true;
    });
  });
});
