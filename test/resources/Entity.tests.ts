import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { awaitResults } from '../utils';
import type {
  IEntity,
  IEntityConnect,
  IEntityCreditScores,
  IEntityIdentity,
  IEntityProduct,
  IEntityProductListResponse,
  TEntityProductType,
  IEntitySubscription,
  IEntitySubscriptionResponse,
  TEntitySubscriptionNames,
  IEntityVerificationSession,
  IEntityAttributes,
} from '../../src/resources/Entity';
import type { IAccount } from '../../src/resources/Account';
import { IResponse } from '../../src/configuration';

should();

describe('Entities - core methods tests', () => {
  let entities_create_response: IResponse<IEntity>;
  let entitiy_with_identity_cap: IResponse<IEntity>;
  let entities_retrieve_response: IResponse<IEntity>;
  let entities_update_response: IResponse<IEntity>;
  let entities_list_response: IResponse<IEntity>[];
  let entities_connect_create_response: IResponse<IEntityConnect>;
  let entities_account_list_response: IResponse<IAccount>[];
  let entities_account_ids: string[];
  let entities_create_credit_score_response: IResponse<IEntityCreditScores>;
  let entities_create_attribute_response: IResponse<IEntityAttributes>;
  let entities_create_idenitity_response: IResponse<IEntityIdentity>;
  let entities_retrieve_product_list_response: IResponse<IEntityProductListResponse>;
  let entities_create_connect_subscription_response: IResponse<IEntitySubscription>;
  let entities_create_credit_score_subscription_response: IResponse<IEntitySubscription>;
  let entities_create_verification_session_response: IResponse<IEntityVerificationSession>;
  let entities_create_phone_verification_session_response: IResponse<IEntityVerificationSession>;

  describe('entities.create', () => {
    it('should successfully create an entity.', async () => {
      entities_create_response = await client.entities.create({
        type: 'individual',
        individual: {},
        metadata: {},
      });

      entities_create_response.restricted_subscriptions?.sort();

      const expect_results: IEntity = {
        id: entities_create_response.id,
        type: 'individual',
        individual: {
          first_name: null,
          last_name: null,
          phone: null,
          dob: null,
          email: null,
          ssn: null,
          ssn_4: null
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null
        },
        verification: {
          identity: {
            verified: false,
            matched: false,
            latest_verification_session: null,
            methods: [
              'element',
              'kba'
            ]
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: [
              'element',
              'sna',
              'sms',
              'byo_sms'
            ]
          }
        },
        connect: null,
        credit_score: null,
        attribute: null,
        products: [],
        restricted_products: entities_create_response.restricted_products,
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'connect', 'credit_score' ].sort() as TEntitySubscriptionNames[],
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_create_response.created_at,
        updated_at: entities_create_response.updated_at,
      };

      entities_create_response.should.be.eql(expect_results);
    });
  });

  describe('entities.retrieve', () => {
    it('should successfully retrieve an entity by id.', async () => {
      entities_retrieve_response = await client.entities.retrieve(entities_create_response.id);
      entities_retrieve_response.restricted_products?.sort();
      entities_retrieve_response.restricted_subscriptions?.sort();

      const expect_results: IEntity = {
        id: entities_create_response.id,
        type: 'individual',
        individual: {
          first_name: null,
          last_name: null,
          phone: null,
          dob: null,
          email: null,
          ssn: null,
          ssn_4: null
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null
        },
        verification: {
          identity: {
            verified: false,
            matched: false,
            latest_verification_session: null,
            methods: [
              'element',
              'kba'
            ]
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: [
              'element',
              'sna',
              'sms',
              'byo_sms'
            ]
          }
        },
        connect: null,
        credit_score: null,
        attribute: null,
        products: [],
        restricted_products: [ 'connect', 'identity', 'credit_score', 'attribute' ].sort() as TEntityProductType[],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'connect', 'credit_score' ].sort() as TEntitySubscriptionNames[],
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_retrieve_response.created_at,
        updated_at: entities_retrieve_response.updated_at,
      };

      entities_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('entities.update', () => {
    it('should successfully update an entity.', async () => {
      entities_update_response = await client.entities.update(
        entities_retrieve_response.id,
        {
          individual: {
            first_name: 'Kevin',
            last_name: 'Doyle',
            phone: '+15121231111',
          },
        },
      );

      entities_update_response.restricted_subscriptions?.sort();
      entities_update_response.restricted_products?.sort();
      
      const expect_results: IEntity = {
        id: entities_create_response.id,
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+15121231111',
          dob: null,
          email: null,
          ssn: null,
          ssn_4: null
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null
        },
        verification: {
          identity: {
            verified: false,
            matched: true,
            latest_verification_session: entities_update_response.verification?.identity?.latest_verification_session || null,
            methods: [
              'element',
              'kba'
            ]
          },
          phone: {
            verified: false,
            latest_verification_session: entities_update_response.verification?.phone?.latest_verification_session || null,
            methods: [
              'element',
              'sna',
              'sms',
              'byo_sms'
            ]
          }
        },
        connect: null,
        credit_score: null,
        attribute: null,
        products: [ 'identity' ],
        restricted_products: ['connect', 'credit_score', 'attribute'].sort() as TEntityProductType[],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'connect', 'credit_score' ].sort() as TEntitySubscriptionNames[],
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_update_response.created_at,
        updated_at: entities_update_response.updated_at,
      };

      entities_update_response.should.be.eql(expect_results);
    });
  });

  describe('entities.list', () => {
    it('should successfully list entities.', async () => {
      entities_list_response = await client.entities.list();

      (entities_list_response !== null).should.be.true;
      Array.isArray(entities_list_response).should.be.true;
    });
  });

  describe('entities.verification_sessions', () => {
    it('should create a phone verification session for an entity', async () => {
      entities_create_phone_verification_session_response = await client.entities(entities_create_response.id).verificationSessions.create({
        type: 'phone',
        method: 'byo_sms',
        byo_sms: {
          timestamp: '2021-09-01T00:00:00.000Z',
        },
      });

      const expect_results: IEntityVerificationSession = {
        id: entities_create_phone_verification_session_response.id,
        entity_id: entities_create_response.id,
        byo_sms: {
          timestamp: '2021-09-01T00:00:00.000Z',
        },
        method: 'byo_sms',
        status: 'verified',
        type: 'phone',
        error: null,
        created_at: entities_create_phone_verification_session_response.created_at,
        updated_at: entities_create_phone_verification_session_response.updated_at,
      };

      entities_create_phone_verification_session_response.should.be.eql(expect_results);
    });

    it('should successfully create an identity verification session for an entity', async () => {
      entities_create_verification_session_response = await client.entities(entities_create_response.id).verificationSessions.create({
        type: 'identity',
        method: 'kba',
        kba: {},
      });

      const expect_results: IEntityVerificationSession = {
        id: entities_create_verification_session_response.id,
        entity_id: entities_create_response.id,
        kba: {
          authenticated: true,
          questions: []
        },
        method: 'kba',
        status: 'verified',
        type: 'identity',
        error: null,
        created_at: entities_create_verification_session_response.created_at,
        updated_at: entities_create_verification_session_response.updated_at,
      };

      entities_create_verification_session_response.should.be.eql(expect_results);
    });

    it('should successfully list verification sessions for an entity', async () => {
      const listVerificationSessions = async () => {
        return await client
          .entities(entities_create_response.id)
          .verificationSessions
          .list();
      };

      const verification_sessions = await awaitResults(listVerificationSessions);

      verification_sessions[0].should.be.eql(entities_create_phone_verification_session_response);
      verification_sessions[1].should.be.eql(entities_create_verification_session_response);
    });
  });

  describe('entities.connect', () => {
    it('should create a connection for an entity', async () => {
      entities_connect_create_response = await client.entities(entities_create_response.id).connect.create();
      entities_connect_create_response.accounts = entities_connect_create_response.accounts?.sort() || null;
      entities_account_list_response = await client.accounts.list({ holder_id: entities_create_response.id, type: 'liability' });
      entities_account_ids = entities_account_list_response.map(account => account.id).sort();
      
      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      entities_connect_create_response.should.be.eql(expect_results);
    });

    it('should retrieve results of a connection for an entity', async () => {
      let entities_connect_results_response = await client.entities(entities_create_response.id).connect.retrieve(entities_connect_create_response.id);
      entities_connect_results_response.accounts = entities_connect_results_response.accounts?.sort() || null;

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      entities_connect_results_response.should.be.eql(expect_results);
    });

    it('should successfully list connections for an entity', async () => {
      const listConnections = async () => {
        return await client
          .entities(entities_create_response.id)
          .connect
          .list();
      };

      const connections = await awaitResults(listConnections);
      connections[0].accounts = connections[0].accounts?.sort() || null;

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      connections[0].should.be.eql(expect_results);
    });
  });

  describe('entities.credit_scores', () => {
    it('should successfully create a credit score request for an entity', async () => {
      entities_create_credit_score_response = await client.entities(entities_create_response.id).creditScores.create();

      const expect_results: IEntityCreditScores = {
        id: entities_create_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'pending',
        scores: null,
        error: null,
        created_at: entities_create_credit_score_response.created_at,
        updated_at: entities_create_credit_score_response.updated_at,
      };

      entities_create_credit_score_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a credit score request for an entity', async () => {
      const getCreditScores = async () => {
        return await client
          .entities(entities_create_response.id)
          .creditScores
          .retrieve(entities_create_credit_score_response.id);
      };

      const credit_scores = await awaitResults(getCreditScores);

      const expect_results: IEntityCreditScores = {
        id: entities_create_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        scores: [
          {
            score: credit_scores.scores[0].score,
            source: 'equifax',
            model: 'vantage_4',
            factors: credit_scores.scores[0].factors,
            created_at: credit_scores.scores[0].created_at,
          }
        ],
        error: null,
        created_at: entities_create_credit_score_response.created_at,
        updated_at: credit_scores.updated_at,
      };

      credit_scores.should.be.eql(expect_results);
    });

    it('should successfully list credit scores for an entity', async () => {
      const listCreditScores = async () => {
        return await client
          .entities(entities_create_response.id)
          .creditScores
          .list();
      };

      const credit_scores = await awaitResults(listCreditScores);

      const expect_results: IEntityCreditScores = {
        id: entities_create_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        scores: [
          {
            score: credit_scores[0].scores[0].score,
            source: 'equifax',
            model: 'vantage_4',
            factors: credit_scores[0].scores[0].factors,
            created_at: credit_scores[0].scores[0].created_at,
          }
        ],
        error: null,
        created_at: entities_create_credit_score_response.created_at,
        updated_at: credit_scores[0].updated_at,
      };

      credit_scores[0].should.be.eql(expect_results);
    });
  });

  describe('entities.attributes', () => {
    it('should successfully create an attributes request for an entity', async () => {
      entities_create_attribute_response = await client.entities(entities_create_response.id).attributes.create();

      const expect_results: IEntityAttributes = {
        id: entities_create_attribute_response.id,
        entity_id: entities_create_response.id,
        status: entities_create_attribute_response.status,
        attributes: entities_create_attribute_response.attributes,
        error: null,
        created_at: entities_create_attribute_response.created_at,
        updated_at: entities_create_attribute_response.updated_at,
      };

      entities_create_attribute_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of an attributes request for an entity', async () => {
      const getAttributes = async () => {
        return await client
          .entities(entities_create_response.id)
          .attributes
          .retrieve(entities_create_attribute_response.id);
      };

      const attributes = await awaitResults(getAttributes);

      const expect_results: IEntityAttributes = {
        id: attributes.id,
        entity_id: entities_create_response.id,
        status: attributes.status,
        attributes: attributes.attributes,
        error: null,
        created_at: attributes.created_at,
        updated_at: attributes.updated_at,
      };

      attributes.should.be.eql(expect_results);
    });

    it('should successfully list attributes for an entity', async () => {
      const listAttributes = async () => {
        return await client
          .entities(entities_create_response.id)
          .attributes
          .list();
      };

      const attributes = await awaitResults(listAttributes);

      attributes[0].should.be.eql(entities_create_attribute_response);
    });
  });

  describe('entities.identites', () => {
    it('should successfully create a request for an identity', async () => {
      entitiy_with_identity_cap = await client.entities.create({
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+16505551115',
        },
      });

      entities_create_idenitity_response = await client.entities(entitiy_with_identity_cap.id).identities.create();

      const expect_results: IEntityIdentity = {
        id: entities_create_idenitity_response.id,
        entity_id: entitiy_with_identity_cap.id,
        status: 'completed',
        identities: [
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX'
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '111223333'
          },
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX'
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '123456789'
          }
        ],
        error: null,
        created_at: entities_create_idenitity_response.created_at,
        updated_at: entities_create_idenitity_response.updated_at,
      };

      entities_create_idenitity_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a request for an identity', async () => {
      const getIdentities = async () => {
        return await client
          .entities(entitiy_with_identity_cap.id)
          .identities
          .retrieve(entities_create_idenitity_response.id);
      };

      const identities = await awaitResults(getIdentities);

      const expect_results: IEntityIdentity = {
        id: entities_create_idenitity_response.id,
        entity_id: entitiy_with_identity_cap.id,
        status: 'completed',
        identities: [
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX'
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '111223333'
          },
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX'
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '123456789'
          }
        ],
        error: null,
        created_at: entities_create_idenitity_response.created_at,
        updated_at: identities.updated_at,
      };

      identities.should.be.eql(expect_results);
    });

    it('should successfully list identities for an entity', async () => {
      const listIdentities = async () => {
        return await client
          .entities(entitiy_with_identity_cap.id)
          .identities
          .list();
      };

      const identities = await awaitResults(listIdentities);

      identities[0].should.be.eql(entities_create_idenitity_response);
    });
  });

  describe('entities.products', () => {
    it('should successfully list products for an entity', async () => {
      entities_retrieve_product_list_response = await client.entities(entities_create_response.id).products.list();

      const expect_results: IEntityProductListResponse = {
        connect: {
          id: entities_retrieve_product_list_response.connect?.id || '',
          name: 'connect',
          status: 'available',
          status_error: null,
          latest_request_id: entities_retrieve_product_list_response.connect?.latest_request_id || null,
          is_subscribable: true,
          created_at: entities_retrieve_product_list_response.connect?.created_at || '',
          updated_at: entities_retrieve_product_list_response.connect?.updated_at || '',
        },
        credit_score: {
          id: entities_retrieve_product_list_response.credit_score?.id || '',
          name: 'credit_score',
          status: 'available',
          status_error: null,
          latest_request_id: entities_retrieve_product_list_response.credit_score?.latest_request_id || null,
          is_subscribable: true,
          created_at: entities_retrieve_product_list_response.credit_score?.created_at || '',
          updated_at: entities_retrieve_product_list_response.credit_score?.updated_at || '',
        },
        identity: {
          id: entities_retrieve_product_list_response.identity?.id || '',
          name: 'identity',
          status: 'available',
          status_error: null,
          latest_request_id: entities_retrieve_product_list_response.identity?.latest_request_id || null,
          is_subscribable: false,
          created_at: entities_retrieve_product_list_response.identity?.created_at || '',
          updated_at: entities_retrieve_product_list_response.identity?.updated_at || '',
        },
        attribute: {
          id: entities_retrieve_product_list_response.attribute?.id || '',
          name: 'attribute',
          status: 'available',
          status_error: null,
          latest_request_id: entities_retrieve_product_list_response.attribute?.latest_request_id || null,
          is_subscribable: false,
          created_at: entities_retrieve_product_list_response.attribute?.created_at || '',
          updated_at: entities_retrieve_product_list_response.attribute?.updated_at || '',
        }
      };

      entities_retrieve_product_list_response.should.be.eql(expect_results);
    });

    it('should retrieve a specific product for an entity', async () => {
      const entity_connect_product = await client.entities(entities_create_response.id).products.retrieve(entities_retrieve_product_list_response.connect?.id || '');
      const entity_credit_score_product = await client.entities(entities_create_response.id).products.retrieve(entities_retrieve_product_list_response.credit_score?.id || '');
      const entity_identity_product = await client.entities(entities_create_response.id).products.retrieve(entities_retrieve_product_list_response.identity?.id || '');
      const entity_attribute_product = await client.entities(entities_create_response.id).products.retrieve(entities_retrieve_product_list_response.attribute?.id || '');
      
      const expect_connect_results: IEntityProduct = {
        id: entities_retrieve_product_list_response.connect?.id || '',
        name: 'connect',
        status: 'available',
        status_error: null,
        latest_request_id: entity_connect_product.latest_request_id,
        is_subscribable: true,
        created_at: entity_connect_product.created_at,
        updated_at: entity_connect_product.updated_at,
      };

      const expect_credit_score_results: IEntityProduct = {
        id: entities_retrieve_product_list_response.credit_score?.id || '',
        name: 'credit_score',
        status: 'available',
        status_error: null,
        latest_request_id: entity_credit_score_product.latest_request_id,
        is_subscribable: true,
        created_at: entity_credit_score_product.created_at,
        updated_at: entity_credit_score_product.updated_at,
      };

      const expect_identity_results: IEntityProduct = {
        id: entities_retrieve_product_list_response.identity?.id || '',
        name: 'identity',
        status: 'available',
        status_error: null,
        latest_request_id: entity_identity_product.latest_request_id,
        is_subscribable: false,
        created_at: entity_identity_product.created_at,
        updated_at: entity_identity_product.updated_at,
      };

      const expect_attribute_results: IEntityProduct = {
        id: entities_retrieve_product_list_response.attribute?.id || '',
        name: 'attribute',
        status: 'available',
        status_error: null,
        latest_request_id: entity_attribute_product.latest_request_id,
        is_subscribable: false,
        created_at: entity_attribute_product.created_at,
        updated_at: entity_attribute_product.updated_at,
      };

      entity_connect_product.should.be.eql(expect_connect_results);
      entity_credit_score_product.should.be.eql(expect_credit_score_results);
      entity_identity_product.should.be.eql(expect_identity_results);
      entity_attribute_product.should.be.eql(expect_attribute_results);
    });
  });

  describe('entities.subscriptions', () => {
    it('should create a connect subscription for an entity', async () => {
      entities_create_connect_subscription_response = await client.entities(entities_create_response.id).subscriptions.create('connect');

      const expect_connect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'active',
        latest_request_id: null,
        created_at: entities_create_connect_subscription_response.created_at,
        updated_at: entities_create_connect_subscription_response.updated_at,
      };

      entities_create_connect_subscription_response.should.be.eql(expect_connect_results, 'connect');
    });

    it('should create a credit_score subscription for an entity', async () => {
      entities_create_credit_score_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions
        .create('credit_score');

      const expect_credit_score_results: IEntitySubscription = {
        id: entities_create_credit_score_subscription_response.id,
        name: 'credit_score',
        status: 'active',
        latest_request_id: null,
        created_at: entities_create_credit_score_subscription_response.created_at,
        updated_at: entities_create_credit_score_subscription_response.updated_at,
      };

      entities_create_credit_score_subscription_response.should.be.eql(expect_credit_score_results, 'credit_score');
    });

    it('should retrieve a subscription for an entity', async () => {
      const entities_connect_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions
        .retrieve(entities_create_connect_subscription_response.id);

      const entities_credit_score_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions
        .retrieve(entities_create_credit_score_subscription_response.id);

      const expect_connect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'active',
        latest_request_id: entities_connect_subscription_response.latest_request_id,
        created_at: entities_connect_subscription_response.created_at,
        updated_at: entities_connect_subscription_response.updated_at,
      };

      const expect_credit_score_results: IEntitySubscription = {
        id: entities_create_credit_score_subscription_response.id,
        name: 'credit_score',
        status: 'active',
        latest_request_id: entities_credit_score_subscription_response.latest_request_id,
        created_at: entities_credit_score_subscription_response.created_at,
        updated_at: entities_credit_score_subscription_response.updated_at,
      }

      entities_connect_subscription_response.should.be.eql(expect_connect_results);
      entities_credit_score_subscription_response.should.be.eql(expect_credit_score_results);
    });

    it('should list subscriptions for an entity', async () => {
      const entities_subscription_list_response = await client
        .entities(entities_create_response.id)
        .subscriptions
        .list();

      const expect_results: IEntitySubscriptionResponse = {
        connect: {
          id: entities_create_connect_subscription_response.id,
          name: 'connect',
          status: 'active',
          latest_request_id: entities_subscription_list_response.connect?.latest_request_id || null,
          created_at: entities_subscription_list_response.connect?.created_at || '',
          updated_at: entities_subscription_list_response.connect?.updated_at || '',
        },
        credit_score: {
          id: entities_create_credit_score_subscription_response.id,
          name: 'credit_score',
          status: 'active',
          latest_request_id: entities_subscription_list_response.credit_score?.latest_request_id || null,
          created_at: entities_subscription_list_response.credit_score?.created_at || '',
          updated_at: entities_subscription_list_response.credit_score?.updated_at || '',
        },
      };

      entities_subscription_list_response.should.be.eql(expect_results);
    });

    it('should delete a subscription for an entity', async () => {
      const entities_subscription_delete_response = await client
        .entities(entities_create_response.id)
        .subscriptions
        .delete(entities_create_connect_subscription_response.id);

      const expect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'inactive',
        latest_request_id: null,
        created_at: entities_subscription_delete_response.created_at,
        updated_at: entities_subscription_delete_response.updated_at,
      };
      
      entities_subscription_delete_response.should.be.eql(expect_results);
    });
  });

  describe('entities.withdrawConsent', async () => {
    it('should successfully withdraw consent for an entity', async () => {
      const entities_withdraw_consent_response = await client
        .entities
        .withdrawConsent(entities_create_response.id);

      const expect_results: IEntity = {
        id: entities_create_response.id,
        type: null,
        individual: null,
        verification: null,
        error: {
          type: 'ENTITY_DISABLED',
          sub_type: 'ENTITY_CONSENT_WITHDRAWN',
          code: 12004,
          message: 'Entity was disabled due to consent withdrawal.'
        },
        address: {},
        status: 'disabled',
        metadata: null,
        created_at: entities_withdraw_consent_response.created_at,
        updated_at: entities_withdraw_consent_response.updated_at,
      };

      entities_withdraw_consent_response.should.be.eql(expect_results);
    });
  });
});
