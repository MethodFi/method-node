import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { ISecret } from '../../src/resources/Secret';
import { IResponse } from '../../src/configuration';

should();

describe('Secrets - core methods tests', () => {
  let secret_create_response: IResponse<ISecret>;
  let secret_retrieve_response: IResponse<ISecret>;

  describe('secrets.create', () => {
    it('should successfully create a secret.', async () => {
      secret_create_response = await client.secrets.create({
        value: 'test-secret-value',
      });

      const expect_results: ISecret = {
        id: secret_create_response.id,
        metadata: secret_create_response.metadata,
        status: 'active',
        created_at: secret_create_response.created_at,
        updated_at: secret_create_response.updated_at,
      };

      secret_create_response.should.be.eql(expect_results);
    });
  });

  describe('secrets.retrieve', () => {
    it('should successfully retrieve a secret.', async () => {
      secret_retrieve_response = await client.secrets.retrieve(secret_create_response.id);

      const expect_results: ISecret = {
        id: secret_create_response.id,
        metadata: secret_retrieve_response.metadata,
        status: 'active',
        created_at: secret_retrieve_response.created_at,
        updated_at: secret_retrieve_response.updated_at,
      };

      secret_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('secrets.list', () => {
    it('should successfully list secrets.', async () => {
      const list_response = await client.secrets.list();

      (list_response.length > 0).should.be.true;
    });
  });

  describe('secrets.delete', () => {
    it('should successfully delete a secret.', async () => {
      const delete_response = await client.secrets.delete(secret_create_response.id);

      (delete_response === null).should.be.true;
    });
  });
});
