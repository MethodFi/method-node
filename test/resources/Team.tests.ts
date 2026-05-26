import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { ITeam, IMLEPublicKey } from '../../src/resources/Team';
import { IResponse } from '../../src/configuration';

should();

describe('Teams - core methods tests', () => {
  let team_retrieve_response: IResponse<ITeam>;
  let mle_public_key_create_response: IResponse<IMLEPublicKey>;

  describe('teams.retrieve', () => {
    it('should successfully retrieve the current team.', async () => {
      team_retrieve_response = await client.teams.retrieve();

      const expect_results: ITeam = {
        id: team_retrieve_response.id,
        parent_id: team_retrieve_response.parent_id,
        name: team_retrieve_response.name,
        legal_name: team_retrieve_response.legal_name,
        logo: team_retrieve_response.logo,
        api_version: team_retrieve_response.api_version,
        status: team_retrieve_response.status,
        products: team_retrieve_response.products,
        keys: team_retrieve_response.keys,
        created_at: team_retrieve_response.created_at,
        updated_at: team_retrieve_response.updated_at,
      };

      team_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('teams.publicKeys', () => {
    it('should successfully create an MLE public key.', async () => {
      mle_public_key_create_response = await client.teams.publicKeys.create({
        jwk: {
          kty: 'EC',
          crv: 'P-256',
          x: 'test_x_value',
          y: 'test_y_value',
        },
      });

      const expect_results: IMLEPublicKey = {
        id: mle_public_key_create_response.id,
        jwk: mle_public_key_create_response.jwk,
        created_at: mle_public_key_create_response.created_at,
        updated_at: mle_public_key_create_response.updated_at,
      };

      mle_public_key_create_response.should.be.eql(expect_results);
    });

    it('should successfully list MLE public keys.', async () => {
      const list_response = await client.teams.publicKeys.list();

      (list_response.length > 0).should.be.true;
    });

    it('should successfully retrieve an MLE public key.', async () => {
      const retrieve_response = await client.teams.publicKeys.retrieve(
        mle_public_key_create_response.id,
      );

      retrieve_response.id.should.equal(mle_public_key_create_response.id);
    });

    it('should successfully delete an MLE public key.', async () => {
      const delete_response = await client.teams.publicKeys.delete(
        mle_public_key_create_response.id,
      );

      (delete_response !== null).should.be.true;
    });
  });
});
