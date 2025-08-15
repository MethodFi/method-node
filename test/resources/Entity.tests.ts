import { should } from 'chai';
import { describe } from 'mocha';
import { client, clientWithPreferAsync } from '../config';
import { awaitResults } from '../utils';
import type {
  IEntity,
  IEntityConnect,
  IEntityCreditScores,
  IEntityIdentity,
  IEntityProduct,
  IEntityProductListResponse,
  IEntitySubscription,
  IEntitySubscriptionResponse,
  IEntityVerificationSession,
  IEntityAttributes,
  IEntityVehicles,
} from '../../src/resources/Entity';
import { EntityAttributeNames } from '../../src/resources/Entity/types';
import type { IAccount } from '../../src/resources/Account';
import { IResponse } from '../../src/configuration';

should();

describe('Entities - core methods tests', () => {
  let entities_create_response: IResponse<IEntity>;
  let entities_create_response_async: IResponse<IEntity>;
  let entity_with_identity_cap: IResponse<IEntity>;
  let entity_with_vehicle: IResponse<IEntity>;
  let entities_retrieve_response: IResponse<IEntity>;
  let entities_update_response: IResponse<IEntity>;
  let entities_update_response_async: IResponse<IEntity>;
  let entities_list_response: IResponse<IEntity>[];
  let entities_connect_create_response: IResponse<IEntityConnect>;
  let entities_connect_create_response_async: IResponse<IEntityConnect>;
  let entities_account_list_response: IResponse<IAccount>[];
  let entities_account_ids: string[];
  let entities_create_credit_score_response: IResponse<IEntityCreditScores>;
  let entities_simulate_credit_score_response: IResponse<IEntityCreditScores>;
  let entities_create_attribute_response: IResponse<IEntityAttributes>;
  let entities_create_idenitity_response: IResponse<IEntityIdentity>;
  let entities_create_vehicle_response: IResponse<IEntityVehicles>;
  let entities_retrieve_product_list_response: IResponse<IEntityProductListResponse>;
  let entities_create_connect_subscription_response: IResponse<IEntitySubscription>;
  let entities_create_credit_score_subscription_response: IResponse<IEntitySubscription>;
  let entities_create_attributes_subscription_response: IResponse<IEntitySubscription>;
  let entities_create_verification_session_response: IResponse<IEntityVerificationSession>;
  let entities_create_phone_verification_session_response: IResponse<IEntityVerificationSession>;

  describe('entities.create', () => {
    it('should successfully create an entity.', async () => {
      entities_create_response = await client.entities.create({
        type: 'individual',
        individual: {},
        metadata: {},
      });

      entities_create_response_async = await clientWithPreferAsync.entities.create({
        type: 'individual',
        individual: {},
        metadata: {},
      });

      entities_create_response.restricted_subscriptions?.sort();
      entities_create_response_async.restricted_subscriptions?.sort();

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
          ssn_4: null,
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null,
        },
        vehicle: null,
        verification: {
          identity: {
            verified: false,
            matched: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'kba'],
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'sna', 'sms', 'byo_sms'],
          },
        },
        connect: null,
        credit_score: null,
        attribute: null,
        products: [],
        restricted_products: entities_create_response.restricted_products,
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: entities_create_response.restricted_subscriptions,
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_create_response.created_at,
        updated_at: entities_create_response.updated_at,
      };

      const expect_results_async: IEntity = {
        id: entities_create_response_async.id,
        type: 'individual',
        individual: {
          first_name: null,
          last_name: null,
          phone: null,
          dob: null,
          email: null,
          ssn: null,
          ssn_4: null,
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null,
        },
        vehicle: null,
        verification: {
          identity: {
            verified: false,
            matched: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'kba'],
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'sna', 'sms', 'byo_sms'],
          },
        },
        connect: null,
        credit_score: null,
        attribute: null,
        products: [],
        restricted_products: entities_create_response_async.restricted_products,
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: entities_create_response_async.restricted_subscriptions,
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_create_response_async.created_at,
        updated_at: entities_create_response_async.updated_at,
      };

      entities_create_response.should.be.eql(expect_results);
      entities_create_response_async.should.be.eql(expect_results_async);
    });
  });

  describe('entities.retrieve', () => {
    it('should successfully retrieve an entity by id.', async () => {
      entities_retrieve_response = await client.entities.retrieve(
        entities_create_response.id
      );
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
          ssn_4: null,
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null,
        },
        verification: {
          identity: {
            verified: false,
            matched: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'kba'],
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'sna', 'sms', 'byo_sms'],
          },
        },
        connect: null,
        vehicle: null,
        credit_score: null,
        attribute: null,
        products: entities_retrieve_response.products,
        restricted_products: entities_retrieve_response.restricted_products,
        subscriptions: entities_retrieve_response.subscriptions,
        available_subscriptions: entities_retrieve_response.available_subscriptions,
        restricted_subscriptions: entities_retrieve_response.restricted_subscriptions,
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
        }
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
          ssn_4: null,
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null,
        },
        verification: {
          identity: {
            verified: false,
            matched: true,
            latest_verification_session:
              entities_update_response.verification?.identity
                ?.latest_verification_session || null,
            methods: ['element', 'opal', 'kba'],
          },
          phone: {
            verified: false,
            latest_verification_session:
              entities_update_response.verification?.phone
                ?.latest_verification_session || null,
            methods: ['element', 'opal', 'sna', 'sms', 'byo_sms'],
          },
        },
        connect: null,
        vehicle: null,
        credit_score: null,
        attribute: null,
        products: entities_update_response.products,
        restricted_products: entities_update_response.restricted_products,
        subscriptions: entities_update_response.subscriptions,
        available_subscriptions: entities_update_response.available_subscriptions,
        restricted_subscriptions: entities_update_response.restricted_subscriptions,
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_update_response.created_at,
        updated_at: entities_update_response.updated_at,
      };

      entities_update_response.should.be.eql(expect_results);

      entities_update_response_async = await clientWithPreferAsync.entities.update(
        entities_create_response_async.id,
        {
          individual: {
            first_name: 'Kevin',
            last_name: 'Doyle',
            phone: '+15121231111',
          },
        }
      );

      entities_update_response_async.restricted_subscriptions?.sort();
      entities_update_response_async.restricted_products?.sort();

      const expect_results_async: IEntity = {
        id: entities_create_response_async.id,
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+15121231111',
          dob: null,
          email: null,
          ssn: null,
          ssn_4: null,
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zip: null,
        },
        verification: {
          identity: {
            verified: false,
            matched: true,
            latest_verification_session: null,
            methods: ['element', 'opal', 'kba'],
          },
          phone: {
            verified: false,
            latest_verification_session: null,
            methods: ['element', 'opal', 'sna', 'sms', 'byo_sms'],
          },
        },
        connect: null,
        vehicle: null,
        credit_score: null,
        attribute: null,
        products: entities_update_response_async.products,
        restricted_products: entities_update_response_async.restricted_products,
        subscriptions: entities_update_response_async.subscriptions,
        available_subscriptions: entities_update_response_async.available_subscriptions,
        restricted_subscriptions: entities_update_response_async.restricted_subscriptions,
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_update_response_async.created_at,
        updated_at: entities_update_response_async.updated_at,
      };

      entities_update_response_async.should.be.eql(expect_results_async);
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
      entities_create_phone_verification_session_response = await client
        .entities(entities_create_response.id)
        .verificationSessions.create({
          type: 'phone',
          method: 'byo_sms',
          byo_sms: {
            timestamp: '2021-09-01T00:00:00.000Z',
          },
        });

      await clientWithPreferAsync
        .entities(entities_create_response_async.id)
        .verificationSessions.create({
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
        created_at:
          entities_create_phone_verification_session_response.created_at,
        updated_at:
          entities_create_phone_verification_session_response.updated_at,
      };

      entities_create_phone_verification_session_response.should.be.eql(
        expect_results
      );
    });

    it('should successfully create an identity verification session for an entity', async () => {
      entities_create_verification_session_response = await client
        .entities(entities_create_response.id)
        .verificationSessions.create({
          type: 'identity',
          method: 'kba',
          kba: {},
        });

      await clientWithPreferAsync
        .entities(entities_create_response_async.id)
        .verificationSessions.create({
          type: 'identity',
          method: 'kba',
          kba: {},
        });

      const expect_results: IEntityVerificationSession = {
        id: entities_create_verification_session_response.id,
        entity_id: entities_create_response.id,
        kba: {
          authenticated: true,
          questions: [],
        },
        method: 'kba',
        status: 'verified',
        type: 'identity',
        error: null,
        created_at: entities_create_verification_session_response.created_at,
        updated_at: entities_create_verification_session_response.updated_at,
      };

      entities_create_verification_session_response.should.be.eql(
        expect_results
      );
    });

    it('should successfully list verification sessions for an entity', async () => {
      const verification_sessions = await client
        .entities(entities_create_response.id)
        .verificationSessions.list();

      // Sort both arrays by type to ensure consistent ordering
      const sorted_verification_sessions = verification_sessions.sort((a, b) =>
        a.type.localeCompare(b.type)
      );
      const sorted_expected_responses = [
        entities_create_phone_verification_session_response,
        entities_create_verification_session_response,
      ].sort((a, b) => a.type.localeCompare(b.type));

      sorted_verification_sessions.should.be.eql(
        sorted_expected_responses
      );
    });
  });

  describe('entities.connect', () => {
    it('should create a connection for an entity', async () => {
      entities_connect_create_response = await client
        .entities(entities_create_response.id)
        .connect.create();
      entities_connect_create_response.accounts =
        entities_connect_create_response.accounts?.sort() || null;
      entities_account_list_response = await client.accounts.list({
        holder_id: entities_create_response.id,
        type: 'liability',
      });
      entities_account_ids = entities_account_list_response
        .map((account) => account.id)
        .sort();

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        requested_products: [],
        requested_subscriptions: [],
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      entities_connect_create_response.should.be.eql(expect_results);
    });

    it('should retrieve results of a connection for an entity', async () => {
      let entities_connect_results_response = await client
        .entities(entities_create_response.id)
        .connect.retrieve(entities_connect_create_response.id);
      entities_connect_results_response.accounts =
        entities_connect_results_response.accounts?.sort() || null;

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        requested_products: [],
        requested_subscriptions: [],
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      entities_connect_results_response.should.be.eql(expect_results);
    });

    it('should successfully list connections for an entity', async () => {
      const connections = await client
        .entities(entities_create_response.id)
        .connect.list();

      connections[0].accounts = connections[0].accounts?.sort() || null;

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        accounts: entities_account_ids,
        requested_products: [],
        requested_subscriptions: [],
        error: null,
        created_at: entities_connect_create_response.created_at,
        updated_at: entities_connect_create_response.updated_at,
      };

      connections[0].should.be.eql(expect_results);
    });

    it('should successfully create a connection for an entity (async).', async () => {
      entities_connect_create_response_async = await clientWithPreferAsync
        .entities(entities_create_response_async.id)
        .connect.create({
          products: ['card_brand'],
          subscriptions: ['update'],
        });

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response_async.id,
        entity_id: entities_create_response_async.id,
        status: 'pending',
        accounts: null,
        requested_products: ['card_brand'],
        requested_subscriptions: ['update'],
        error: null,
        created_at: entities_connect_create_response_async.created_at,
        updated_at: entities_connect_create_response_async.updated_at,
      };

      entities_connect_create_response_async.should.be.eql(expect_results);
    });

    it('should successfully retrieve results of a connection for an entity (async).', async () => {
      let entitiesConnectRetrieveResponse = async () => {
        return await clientWithPreferAsync
          .entities(entities_create_response_async.id)
          .connect.retrieve(entities_connect_create_response_async.id);
      };

      const entities_connect_results_response_async = await awaitResults(entitiesConnectRetrieveResponse);

      entities_connect_results_response_async.accounts =
        entities_connect_results_response_async.accounts?.sort() || null;

      const expect_results: IEntityConnect = {
        id: entities_connect_create_response_async.id,
        entity_id: entities_create_response_async.id,
        status: 'completed',
        accounts: entities_connect_results_response_async.accounts,
        requested_products: ['card_brand'],
        requested_subscriptions: ['update'],
        error: null,
        created_at: entities_connect_results_response_async.created_at,
        updated_at: entities_connect_results_response_async.updated_at,
      };

      entities_connect_results_response_async.should.be.eql(expect_results);
    });
  });

  describe('entities.credit_scores', () => {
    it('should successfully create a credit score request for an entity', async () => {
      entities_create_credit_score_response = await client
        .entities(entities_create_response.id)
        .creditScores.create();

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

    it('should successfully simulate a credit score request for an entity', async () => {
      entities_simulate_credit_score_response = await client
        .simulate
        .entities(entities_create_response.id)
        .creditScores(entities_create_credit_score_response.id)
        .create({
          scores: [
            {
              score: 800,
              source: "equifax",
              model: "vantage_4",
              factors: [
                {
                  code: "00034",
                  description: "Total of all balances on bankcard or revolving accounts is too high"
                },
                {
                  code: "00012",
                  description: "The date that you opened your oldest account is too recent"
                },
                {
                  code: "00063",
                  description: "Lack of sufficient relevant real estate account information"
                }
              ],
              created_at: new Date().toISOString(),
            }
          ]
        });

      const expect_results: IEntityCreditScores = {
        id: entities_simulate_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        scores: entities_simulate_credit_score_response.scores,
        error: null,
        created_at: entities_simulate_credit_score_response.created_at,
        updated_at: entities_simulate_credit_score_response.updated_at,
      };

      entities_simulate_credit_score_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a credit score request for an entity', async () => {
      const credit_scores = await client
        .entities(entities_create_response.id)
        .creditScores.retrieve(entities_create_credit_score_response.id);

      const expect_results: IEntityCreditScores = {
        id: entities_create_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        scores: [
          {
            score: 800,
            source: "equifax",
            model: "vantage_4",
            factors: [
              {
                code: "00034",
                description: "Total of all balances on bankcard or revolving accounts is too high"
              },
              {
                code: "00012",
                description: "The date that you opened your oldest account is too recent"
              },
              {
                code: "00063",
                description: "Lack of sufficient relevant real estate account information"
              }
            ],
            created_at: credit_scores.scores?.[0]?.created_at || '',
          }
        ],
        error: null,
        created_at: entities_create_credit_score_response.created_at,
        updated_at: credit_scores.updated_at,
      };

      credit_scores.should.be.eql(expect_results);
    });

    it('should successfully list credit scores for an entity', async () => {
      const credit_scores = await client
        .entities(entities_create_response.id)
        .creditScores.list();

      const expect_results: IEntityCreditScores = {
        id: entities_create_credit_score_response.id,
        entity_id: entities_create_response.id,
        status: 'completed',
        scores: [
          {
            score: 800,
            source: "equifax",
            model: "vantage_4",
            factors: [
              {
                code: "00034",
                description: "Total of all balances on bankcard or revolving accounts is too high"
              },
              {
                code: "00012",
                description: "The date that you opened your oldest account is too recent"
              },
              {
                code: "00063",
                description: "Lack of sufficient relevant real estate account information"
              }
            ],
            created_at: credit_scores[0].scores?.[0]?.created_at || '',
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
      entities_create_attribute_response = await client
        .entities(entities_create_response.id)
        .attributes.create({
          attributes: [EntityAttributeNames.credit_health_credit_card_usage]
        });

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
      const attributes = await client
        .entities(entities_create_response.id)
        .attributes.retrieve(entities_create_attribute_response.id);

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
      const attributes = await client
        .entities(entities_create_response.id)
        .attributes.list();

      attributes[0].should.be.eql(entities_create_attribute_response);
    });
  });

  describe('entities.identites', () => {
    it('should successfully create a request for an identity', async () => {
      entity_with_identity_cap = await client.entities.create({
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+16505551115',
        },
      });

      entities_create_idenitity_response = await client
        .entities(entity_with_identity_cap.id)
        .identities.create();

      const expect_results: IEntityIdentity = {
        id: entities_create_idenitity_response.id,
        entity_id: entity_with_identity_cap.id,
        status: 'completed',
        identities: [
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX',
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '111223333',
          },
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX',
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '123456789',
          },
        ],
        error: null,
        created_at: entities_create_idenitity_response.created_at,
        updated_at: entities_create_idenitity_response.updated_at,
      };

      entities_create_idenitity_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a request for an identity', async () => {
      const identities = await client
        .entities(entity_with_identity_cap.id)
        .identities.retrieve(entities_create_idenitity_response.id);

      const expect_results: IEntityIdentity = {
        id: entities_create_idenitity_response.id,
        entity_id: entity_with_identity_cap.id,
        status: 'completed',
        identities: [
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX',
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '111223333',
          },
          {
            address: {
              address: '3300 N INTERSTATE 35',
              city: 'AUSTIN',
              postal_code: '78705',
              state: 'TX',
            },
            dob: '1997-03-18',
            first_name: 'KEVIN',
            last_name: 'DOYLE',
            phone: '+16505551115',
            ssn: '123456789',
          },
        ],
        error: null,
        created_at: entities_create_idenitity_response.created_at,
        updated_at: identities.updated_at,
      };

      identities.should.be.eql(expect_results);
    });

    it('should successfully list identities for an entity', async () => {
      const identities = await client
        .entities(entity_with_identity_cap.id)
        .identities.list();

      identities[0].should.be.eql(entities_create_idenitity_response);
    });
  });

  describe('entities.vehicles', () => {
    it('should successfully create a request for a vehicle', async () => {
      entity_with_vehicle = await client.entities.create({
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          phone: '+15121231122',
        },
      });

      await client.entities(entity_with_vehicle.id).verificationSessions.create({
          type: 'phone',
          method: 'byo_sms',
          byo_sms: {
            timestamp: '2021-09-01T00:00:00.000Z',
          },
      });

      await client.entities(entity_with_vehicle.id).verificationSessions.create({
        type: 'identity',
        method: 'kba',
        kba: {},
      });

      await client.entities(entity_with_vehicle.id).connect.create();


      entities_create_vehicle_response = await client
        .entities(entity_with_vehicle.id)
        .vehicles.create();

      const expect_results: IEntityVehicles = {
        id: entities_create_vehicle_response.id,
        entity_id: entity_with_vehicle.id,
        status: 'completed',
        vehicles: entities_create_vehicle_response.vehicles,
        error: null,
        created_at: entities_create_vehicle_response.created_at,
        updated_at: entities_create_vehicle_response.updated_at,
      };

      entities_create_vehicle_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a request for a vehicle', async () => {
      const vehicles = await client
          .entities(entity_with_vehicle.id)
          .vehicles.retrieve(entities_create_vehicle_response.id);

      const expect_results: IEntityVehicles = {
        id: entities_create_vehicle_response.id,
        entity_id: entity_with_vehicle.id,
        status: 'completed',
        vehicles: vehicles.vehicles,
        error: null,
        created_at: entities_create_vehicle_response.created_at,
        updated_at: vehicles.updated_at,
      };

      vehicles.should.be.eql(expect_results);
    });

    it('should successfully list vehicles for an entity', async () => {
      const vehicles = await client
        .entities(entity_with_vehicle.id)
        .vehicles.list();

      vehicles[0].should.be.eql(entities_create_vehicle_response);
    });
  });

  describe('entities.products', () => {
    it('should successfully list products for an entity', async () => {
      entities_retrieve_product_list_response = await client
        .entities(entities_create_response.id)
        .products.list();

      const expect_results: IEntityProductListResponse = {
        connect: {
          name: 'connect',
          status: 'available',
          status_error: null,
          latest_request_id:
            entities_retrieve_product_list_response.connect
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.connect?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at:
            entities_retrieve_product_list_response.connect?.created_at || '',
          updated_at:
            entities_retrieve_product_list_response.connect?.updated_at || '',
        },
        credit_score: {
          name: 'credit_score',
          status: 'available',
          status_error: null,
          latest_request_id:
            entities_retrieve_product_list_response.credit_score
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.credit_score?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at:
            entities_retrieve_product_list_response.credit_score?.created_at ||
            '',
          updated_at:
            entities_retrieve_product_list_response.credit_score?.updated_at ||
            '',
        },
        identity: {
          name: 'identity',
          status: 'available',
          status_error: null,
          latest_request_id:
            entities_retrieve_product_list_response.identity
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.identity?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at:
            entities_retrieve_product_list_response.identity?.created_at || '',
          updated_at:
            entities_retrieve_product_list_response.identity?.updated_at || '',
        },
        attribute: {
          name: 'attribute',
          status: 'available',
          status_error: null,
          latest_request_id:
            entities_retrieve_product_list_response.attribute
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.attribute?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at:
            entities_retrieve_product_list_response.attribute?.created_at || '',
          updated_at:
            entities_retrieve_product_list_response.attribute?.updated_at || '',
        },
        vehicle: {
          name: 'vehicle',
          status: 'available',
          status_error: null,
          latest_request_id:
            entities_retrieve_product_list_response.vehicle
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.vehicle?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: entities_retrieve_product_list_response.vehicle?.created_at || '',
          updated_at: entities_retrieve_product_list_response.vehicle?.updated_at || '',
        },
        manual_connect: {
          name: 'manual_connect',
          status: 'restricted',
          status_error: entities_retrieve_product_list_response.manual_connect?.status_error || null,
          latest_request_id:
            entities_retrieve_product_list_response.manual_connect
              ?.latest_request_id || null,
          latest_successful_request_id: entities_retrieve_product_list_response.manual_connect?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: entities_retrieve_product_list_response.manual_connect?.created_at || '',
          updated_at: entities_retrieve_product_list_response.manual_connect?.updated_at || '',
        }
      };

      entities_retrieve_product_list_response.should.be.eql(expect_results);
    });
  });

  describe('entities.subscriptions', () => {
    it('should create a connect subscription for an entity', async () => {
      entities_create_connect_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions.create('connect');

      const expect_connect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: entities_create_connect_subscription_response.created_at,
        updated_at: entities_create_connect_subscription_response.updated_at,
      };

      entities_create_connect_subscription_response.should.be.eql(
        expect_connect_results,
        'connect'
      );
    });

    it('should create a credit_score subscription for an entity', async () => {
      entities_create_credit_score_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions.create('credit_score');

      const expect_credit_score_results: IEntitySubscription = {
        id: entities_create_credit_score_subscription_response.id,
        name: 'credit_score',
        status: 'active',
        latest_request_id: null,
        payload: null,
        created_at:
          entities_create_credit_score_subscription_response.created_at,
        updated_at:
          entities_create_credit_score_subscription_response.updated_at,
      };

      entities_create_credit_score_subscription_response.should.be.eql(
        expect_credit_score_results,
        'credit_score'
      );
    });

    it('should create an attributes subscription for an entity', async () => {
      entities_create_attributes_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions.create({
          enroll: 'attribute',
          payload: {
            attributes: {
              requested_attributes: [EntityAttributeNames.credit_health_credit_card_usage]
            }
          }
        });

      const expect_results: IEntitySubscription = {
        id: entities_create_attributes_subscription_response.id,
        name: 'attribute',
        status: 'active',
        payload: {
          attributes: {
            requested_attributes: [EntityAttributeNames.credit_health_credit_card_usage]
          }
        },
        latest_request_id: entities_create_attributes_subscription_response.latest_request_id,
        created_at: entities_create_attributes_subscription_response.created_at,
        updated_at: entities_create_attributes_subscription_response.updated_at,
      };

      entities_create_attributes_subscription_response.should.be.eql(expect_results);
    });

    it('should retrieve a subscription for an entity', async () => {
      const entities_connect_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions.retrieve(
          entities_create_connect_subscription_response.id
        );

      const entities_credit_score_subscription_response = await client
        .entities(entities_create_response.id)
        .subscriptions.retrieve(
          entities_create_credit_score_subscription_response.id
        );

      const expect_connect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'active',
        payload: null,
        latest_request_id:
          entities_connect_subscription_response.latest_request_id,
        created_at: entities_connect_subscription_response.created_at,
        updated_at: entities_connect_subscription_response.updated_at,
      };

      const expect_credit_score_results: IEntitySubscription = {
        id: entities_create_credit_score_subscription_response.id,
        name: 'credit_score',
        status: 'active',
        payload: null,
        latest_request_id:
          entities_credit_score_subscription_response.latest_request_id,
        created_at: entities_credit_score_subscription_response.created_at,
        updated_at: entities_credit_score_subscription_response.updated_at,
      };

      entities_connect_subscription_response.should.be.eql(
        expect_connect_results
      );
      entities_credit_score_subscription_response.should.be.eql(
        expect_credit_score_results
      );
    });

    it('should list subscriptions for an entity', async () => {
      const entities_subscription_list_response = await client
        .entities(entities_create_response.id)
        .subscriptions.list();

      const expect_results: IEntitySubscriptionResponse = {
        attribute: {
          id: entities_create_attributes_subscription_response.id,
          name: 'attribute',
          status: 'active',
          payload: {
            attributes: {
              requested_attributes: [EntityAttributeNames.credit_health_credit_card_usage]
            }
          },
          latest_request_id:
            entities_subscription_list_response.attribute?.latest_request_id ||
            null,
          created_at:
            entities_subscription_list_response.attribute?.created_at || '',
          updated_at:
            entities_subscription_list_response.attribute?.updated_at || '',
        },
        connect: {
          id: entities_create_connect_subscription_response.id,
          name: 'connect',
          status: 'active',
          payload: null,
          latest_request_id:
            entities_subscription_list_response.connect?.latest_request_id ||
            null,
          created_at:
            entities_subscription_list_response.connect?.created_at || '',
          updated_at:
            entities_subscription_list_response.connect?.updated_at || '',
        },
        credit_score: {
          id: entities_create_credit_score_subscription_response.id,
          name: 'credit_score',
          status: 'active',
          payload: null,
          latest_request_id:
            entities_subscription_list_response.credit_score
              ?.latest_request_id || null,
          created_at:
            entities_subscription_list_response.credit_score?.created_at || '',
          updated_at:
            entities_subscription_list_response.credit_score?.updated_at || '',
        },
      };

      entities_subscription_list_response.should.be.eql(expect_results);
    });

    it('should delete a subscription for an entity', async () => {
      const entities_subscription_delete_response = await client
        .entities(entities_create_response.id)
        .subscriptions.delete(entities_create_connect_subscription_response.id);

      const expect_results: IEntitySubscription = {
        id: entities_create_connect_subscription_response.id,
        name: 'connect',
        status: 'inactive',
        payload: null,
        latest_request_id: null,
        created_at: entities_subscription_delete_response.created_at,
        updated_at: entities_subscription_delete_response.updated_at,
      };

      entities_subscription_delete_response.should.be.eql(expect_results);
    });
  });

  describe('entities.withdrawConsent', async () => {
    it('should successfully withdraw consent for an entity', async () => {
      const entities_withdraw_consent_response =
        await client.entities.withdrawConsent(entities_create_response.id);

      const expect_results: IEntity = {
        id: entities_create_response.id,
        type: null,
        individual: null,
        verification: null,
        error: {
          type: 'ENTITY_DISABLED',
          sub_type: 'ENTITY_CONSENT_WITHDRAWN',
          code: 12004,
          message: 'Entity was disabled due to consent withdrawal.',
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
