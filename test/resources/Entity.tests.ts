import { should } from 'chai';
import { client } from '../config';
import { IEntity } from '../../src/resources/Entity/types';
import { IEntityConnect } from '../../src/resources/Entity/Connect';
import { IAccount } from '../../src/resources/Account/types';

should();

describe.only('Entities - core methods tests', () => {
  let entities_create_response: IEntity | null = null;
  let entities_get_response: IEntity | null = null;
  let entities_update_response: IEntity | null = null;
  let entities_list_response: IEntity[] | null = null;
  let entities_refresh_capabilities_response: IEntity | null;
  let entities_connect_create_response: IEntityConnect | null = null;
  let entities_account_list_response: IAccount[] | null = null;
  let entities_account_ids: string[] = [];

  describe('entities.create', () => {
    it('should successfully create an entity.', async () => {
      entities_create_response = await client.entities.create({
        type: 'individual',
        individual: {},
        metadata: {},
      });

      (entities_create_response !== null).should.be.true;
    });
  });

  describe('entities.get', () => {
    it('should successfully get an entity.', async () => {
      entities_get_response = await client.entities.retrieve(entities_create_response?.id || '');

      (entities_get_response !== null).should.be.true;
    });
  });

  describe('entities.update', () => {
    it('should successfully update an entity.', async () => {
      entities_update_response = await client.entities.update(
        entities_get_response?.id || '',
        {
          individual: {
            first_name: 'Kevin',
            last_name: 'Doyle',
            phone: '+15121231111',
          },
        },
      );

      (entities_update_response !== null).should.be.true;
    });
  });

  describe('entities.list', () => {
    it('should successfully list entities.', async () => {
      entities_list_response = await client.entities.list();

      (entities_list_response !== null).should.be.true;
      Array.isArray(entities_list_response).should.be.true;
    });
  });

  describe('entities.refresh_capabilities', () => {
    it('should successfully refresh entity capabilities', async () => {
      entities_refresh_capabilities_response = await client.entities.refreshCapabilities(entities_create_response?.id || '');

      (entities_refresh_capabilities_response !== null).should.be.true
    });
  });

  describe('entities.connect', () => {
    it('should create a connection for an entity', async () => {
      entities_connect_create_response = await client.entities(entities_create_response?.id || '').connect.create();
      entities_connect_create_response.accounts = entities_connect_create_response?.accounts?.sort() || null;
      entities_account_list_response = await client.accounts.list({ holder_id: entities_create_response?.id || '', type: 'liability' });
      entities_account_ids = entities_account_list_response.map(account => account.id).sort();
      
      const expect_results = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response?.id,
        status: 'completed',
        accounts: entities_account_ids,
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      entities_connect_create_response.should.be.eql(expect_results);
    });

    it('should retrieve results of a connection for an entity', async () => {
      let entities_connect_results_response = await client.entities(entities_create_response?.id || '').connect.retrieve(entities_connect_create_response?.id || '');
      entities_connect_results_response.accounts = entities_connect_results_response?.accounts?.sort() || null;

      const expect_results = {
        id: entities_connect_create_response?.id,
        entity_id: entities_create_response?.id,
        status: 'completed',
        accounts: entities_account_ids,
        error: null,
        created_at: entities_connect_create_response?.created_at,
        updated_at: entities_connect_create_response?.updated_at,
      };

      entities_connect_results_response.should.be.eql(expect_results);
    });
  });
});
