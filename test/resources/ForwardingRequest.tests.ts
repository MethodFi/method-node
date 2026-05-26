import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IForwardingRequest } from '../../src/resources/ForwardingRequest';
import { IResponse } from '../../src/configuration';

should();

describe('ForwardingRequests - core methods tests', () => {
  let forwarding_request_create_response: IResponse<IForwardingRequest>;

  describe('forwardingRequests.create', () => {
    it('should successfully create a forwarding request.', async () => {
      forwarding_request_create_response = await client.forwardingRequests.create({
        url: 'https://example.com/api',
        method: 'GET',
        headers: {},
        body: '',
        bindings: {},
      });

      const expect_results: IForwardingRequest = {
        id: forwarding_request_create_response.id,
        bindings: forwarding_request_create_response.bindings,
        request: forwarding_request_create_response.request,
        response: forwarding_request_create_response.response,
        duration_ms: forwarding_request_create_response.duration_ms,
        status: forwarding_request_create_response.status,
        status_history: forwarding_request_create_response.status_history,
        created_at: forwarding_request_create_response.created_at,
      };

      forwarding_request_create_response.should.be.eql(expect_results);
    });
  });

  describe('forwardingRequests.retrieve', () => {
    it('should successfully retrieve a forwarding request.', async () => {
      const retrieve_response = await client.forwardingRequests.retrieve(
        forwarding_request_create_response.id,
      );

      retrieve_response.id.should.equal(forwarding_request_create_response.id);
    });
  });
});
