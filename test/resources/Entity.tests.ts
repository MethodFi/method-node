import { should } from 'chai';
import { MethodClient, Environments } from '../../src';
import { IEntity } from '../../src/resources/Entity';

should();

const client = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Entities - core methods tests', () => {
  let entities_create_response: IEntity | null = null;
  let entities_get_response: IEntity | null = null;
  let entities_update_response: IEntity | null = null;
  let entities_list_response: IEntity[] | null = null;

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
      entities_get_response = await client.entities.get(entities_create_response.id);

      (entities_get_response !== null).should.be.true;
    });
  });

  describe('entities.update', () => {
    it('should successfully update an entity.', async () => {
      entities_update_response = await client.entities.update(
        entities_get_response.id,
        { individual: { first_name: 'Kevin', last_name: 'Doyle' } },
      );

      (entities_update_response !== null).should.be.true;
    });
  });

  describe('entities.update', () => {
    it('should successfully list entities.', async () => {
      entities_list_response = await client.entities.list();

      (entities_list_response !== null).should.be.true;
      Array.isArray(entities_list_response).should.be.true;
    });
  });
});
