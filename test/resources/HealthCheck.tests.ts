import { should } from 'chai';
import { describe, it } from 'mocha';
import { client } from '../config';
import { IPingResponse } from '../../src/resources/HealthCheck';

should();

describe('Health Check - core methods tests', () => {
  describe('method_client.ping', () => {
    it('should successfully perform a health check (ping) and log response A.', async () => {
      const check = await client.ping();
      check.should.not.be.null;
      
      const expect_results: IPingResponse = {
        success: true,
        data: null,
        message: 'pong',
      };

      check.should.be.eql(expect_results);
    });
  });
});
