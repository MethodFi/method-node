import { should } from 'chai';
import { MethodClient, Environments } from '../../src';
import { IEntity, IEntityQuestionResponse } from '../../src/resources/Entity';

should();

const client = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Entities - core methods tests', () => {
  let entities_create_response: IEntity | null = null;
  let entities_get_response: IEntity | null = null;
  let entities_update_response: IEntity | null = null;
  let entities_list_response: IEntity[] | null = null;
  let entities_create_auth_session_response: IEntityQuestionResponse | null;
  let entities_update_auth_session_response: IEntityQuestionResponse | null;
  let entities_refresh_capabilities_response: IEntity | null;

  describe('entities.create', () => {
    it('should successfully create an entity.', async () => {
      entities_create_response = await client.entities.create({
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+15121231111',
        },
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

  describe('entities.list', () => {
    it('should successfully list entities.', async () => {
      entities_list_response = await client.entities.list();

      (entities_list_response !== null).should.be.true;
      Array.isArray(entities_list_response).should.be.true;
    });
  });

  describe('entities.create_auth_session', () => {
    it('should successfully initiate an authenticated session for the entity', async () => {
      entities_create_auth_session_response = await client.entities.createAuthSession(entities_create_response.id);

      (entities_create_auth_session_response !== null).should.be.true
    })
  })

  describe('entities.update_auth_session', () => {
    it('should successfully provide answers to the security questions', async () => {
      entities_update_auth_session_response = await client.entities.updateAuthSession(entities_create_response.id, {
        answers: [
          {
            question_id: entities_create_auth_session_response.questions[0].id,
            answer_id: entities_create_auth_session_response.questions[0].answers[0].id
          },
          {
            question_id: entities_create_auth_session_response.questions[1].id,
            answer_id: entities_create_auth_session_response.questions[1].answers[0].id
          },
          {
            question_id: entities_create_auth_session_response.questions[2].id,
            answer_id: entities_create_auth_session_response.questions[2].answers[0].id
          }
        ]
      });

      (entities_create_auth_session_response !== null).should.be.true
    })
  })

  describe('entities.refresh_capabilities', () => {
    it('should successfully refresh entity capabilities', async () => {
      entities_refresh_capabilities_response = await client.entities.refreshCapabilities(entities_create_response.id);

      (entities_refresh_capabilities_response !== null).should.be.true
    })
  })
});
