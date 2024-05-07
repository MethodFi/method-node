import { should } from 'chai';
import { client } from '../config';
import { awaitResults } from '../utils';
import { IEntity } from '../../src/resources/Entity/types';
import { IEntityConnect } from '../../src/resources/Entity/Connect';
import { IAccount } from '../../src/resources/Account/types';
import { IEntityCreditScores } from '../../src/resources/Entity/CreditScores';
import { IEntityIdentity } from '../../src/resources/Entity/Identities';
import { IEntityProductListResponse } from '../../src/resources/Entity/Products';
import { IEntitySubscriptionCreateResponse } from '../../src/resources/Entity/Subscriptions';
import { IEntityVerificationSession } from '../../src/resources/Entity/VerificationSessions';

should();

describe.only('Entities - core methods tests', () => {
  let entities_create_response: IEntity | null = null;
  let entitiy_with_identity_cap: IEntity | null = null;
  let entities_get_response: IEntity | null = null;
  let entities_update_response: IEntity | null = null;
  let entities_list_response: IEntity[] | null = null;
  let entities_connect_create_response: IEntityConnect | null = null;
  let entities_account_list_response: IAccount[] | null = null;
  let entities_account_ids: string[] = [];
  let entities_create_credit_score_response: IEntityCreditScores | null = null;
  let entities_create_idenitity_response: IEntityIdentity | null = null;
  let entities_get_product_list_response: IEntityProductListResponse | null = null;
  let entities_create_connect_subscription_response: IEntitySubscriptionCreateResponse | null = null;
  let entities_create_credit_score_subscription_response: IEntitySubscriptionCreateResponse | null = null;
  let entities_create_verification_session_response: IEntityVerificationSession | null = null;

  describe('entities.create', () => {
    it('should successfully create an entity.', async () => {
      entities_create_response = await client.entities.create({
        type: 'individual',
        individual: {},
        metadata: {},
      });

      const expect_results = {
        id: entities_create_response?.id,
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
        address: { line1: null, line2: null, city: null, state: null, zip: null },
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
        products: [],
        restricted_products: entities_create_response?.restricted_products,
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'connect', 'credit_score' ],
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_create_response?.created_at,
        updated_at: entities_create_response?.updated_at
      };

      entities_create_response.should.be.eql(expect_results);
    });
  });

  describe('entities.get', () => {
    it('should successfully get an entity.', async () => {
      entities_get_response = await client.entities.retrieve(entities_create_response?.id || '');
      entities_get_response?.restricted_products?.sort();

      const expect_results = {
        id: entities_create_response?.id,
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
        address: { line1: null, line2: null, city: null, state: null, zip: null },
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
        products: [],
        restricted_products: [ 'connect', 'identity', 'credit_score' ].sort(),
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'connect', 'credit_score' ],
        status: 'incomplete',
        error: null,
        metadata: {},
        created_at: entities_get_response?.created_at,
        updated_at: entities_get_response?.updated_at
      };

      entities_get_response.should.be.eql(expect_results);
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

      entities_update_response?.available_subscriptions?.sort();
      entities_update_response?.products?.sort();
      
      const expect_results = {
        id: entities_create_response?.id,
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
        address: { line1: null, line2: null, city: null, state: null, zip: null },
        verification: {
          identity: {
            verified: true,
            matched: true,
            latest_verification_session: entities_update_response?.verification?.identity?.latest_verification_session,
            methods: []
          },
          phone: {
            verified: true,
            latest_verification_session: entities_update_response?.verification?.phone?.latest_verification_session,
            methods: []
          }
        },
        connect: null,
        credit_score: null,
        products: [ 'connect', 'credit_score', 'identity' ].sort(),
        restricted_products: [],
        subscriptions: [],
        available_subscriptions: [ 'connect', 'credit_score' ].sort(),
        restricted_subscriptions: [],
        status: 'active',
        error: null,
        metadata: {},
        created_at: entities_update_response?.created_at,
        updated_at: entities_update_response?.updated_at
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

  describe('entities.credit_scores', () => {
    it('should successfully create a credit score request for an entity', async () => {
      entities_create_credit_score_response = await client.entities(entities_create_response?.id || '').creditScores.create();

      const expect_results = {
        id: entities_create_credit_score_response?.id,
        entity_id: entities_create_response?.id,
        status: 'pending',
        scores: null,
        error: null,
        created_at: entities_create_credit_score_response?.created_at,
        updated_at: entities_create_credit_score_response?.updated_at,
      };

      entities_create_credit_score_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a credit score request for an entity', async () => {
      const getCreditScores = async () => {
        return await client
          .entities(entities_create_response?.id || '')
          .creditScores
          .retrieve(entities_create_credit_score_response?.id || '');
      };

      const credit_scores = await awaitResults(getCreditScores);

      const expect_results = {
        id: entities_create_credit_score_response?.id,
        entity_id: entities_create_response?.id,
        status: 'completed',
        scores: [
          {
            score: credit_scores?.scores?.[0].score,
            source: 'equifax',
            model: 'vantage_3',
            factors: credit_scores?.scores?.[0].factors,
            created_at: credit_scores?.scores?.[0].created_at,
          }
        ],
        error: null,
        created_at: entities_create_credit_score_response?.created_at,
        updated_at: credit_scores?.updated_at,
      };

      credit_scores.should.be.eql(expect_results);
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

      entities_create_idenitity_response = await client.entities(entitiy_with_identity_cap?.id || '').identities.create();

      const expect_results = {
        id: entities_create_idenitity_response?.id,
        entity_id: entitiy_with_identity_cap?.id,
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
        created_at: entities_create_idenitity_response?.created_at,
        updated_at: entities_create_idenitity_response?.updated_at,
      };

      entities_create_idenitity_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the results of a request for an identity', async () => {
      const getIdentities = async () => {
        return await client
          .entities(entitiy_with_identity_cap?.id || '')
          .identities
          .retrieve(entities_create_idenitity_response?.id || '');
      };

      const identities = await awaitResults(getIdentities);

      const expect_results = {
        id: entities_create_idenitity_response?.id,
        entity_id: entitiy_with_identity_cap?.id,
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
        created_at: entities_create_idenitity_response?.created_at,
        updated_at: identities?.updated_at,
      };

      identities.should.be.eql(expect_results);
    });
  });

  describe('entities.products', () => {
    it('should successfully list products for an entity', async () => {
      entities_get_product_list_response = await client.entities(entities_create_response?.id || '').products.list();

      const expect_results = {
        connect: {
          id: entities_get_product_list_response?.connect?.id,
          name: 'connect',
          status: 'available',
          status_error: null,
          latest_request_id: entities_get_product_list_response?.connect?.latest_request_id,
          is_subscribable: true,
          created_at: entities_get_product_list_response?.connect?.created_at,
          updated_at: entities_get_product_list_response?.connect?.updated_at,
        },
        credit_score: {
          id: entities_get_product_list_response?.credit_score?.id,
          name: 'credit_score',
          status: 'available',
          status_error: null,
          latest_request_id: entities_get_product_list_response?.credit_score?.latest_request_id,
          is_subscribable: true,
          created_at: entities_get_product_list_response?.credit_score?.created_at,
          updated_at: entities_get_product_list_response?.credit_score?.updated_at,
        },
        identity: {
          id: entities_get_product_list_response?.identity?.id,
          name: 'identity',
          status: 'available',
          status_error: null,
          latest_request_id: entities_get_product_list_response?.identity?.latest_request_id,
          is_subscribable: false,
          created_at: entities_get_product_list_response?.identity?.created_at,
          updated_at: entities_get_product_list_response?.identity?.updated_at,
        }
      };

      entities_get_product_list_response.should.be.eql(expect_results);
    });

    it('should retrieve a specific product for an entity', async () => {
      const entity_connect_product = await client.entities(entities_create_response?.id || '').products.retrieve(entities_get_product_list_response?.connect?.id || '');
      const entity_credit_score_product = await client.entities(entities_create_response?.id || '').products.retrieve(entities_get_product_list_response?.credit_score?.id || '');
      const entity_identity_product = await client.entities(entities_create_response?.id || '').products.retrieve(entities_get_product_list_response?.identity?.id || '');
      
      const expect_connect_results = {
        id: entities_get_product_list_response?.connect?.id,
        name: 'connect',
        status: 'available',
        status_error: null,
        latest_request_id: entity_connect_product.latest_request_id,
        is_subscribable: true,
        created_at: entity_connect_product.created_at,
        updated_at: entity_connect_product.updated_at,
      };

      const expect_credit_score_results = {
        id: entities_get_product_list_response?.credit_score?.id,
        name: 'credit_score',
        status: 'available',
        status_error: null,
        latest_request_id: entity_credit_score_product.latest_request_id,
        is_subscribable: true,
        created_at: entity_credit_score_product.created_at,
        updated_at: entity_credit_score_product.updated_at,
      };

      const expect_identity_results = {
        id: entities_get_product_list_response?.identity?.id,
        name: 'identity',
        status: 'available',
        status_error: null,
        latest_request_id: entity_identity_product.latest_request_id,
        is_subscribable: false,
        created_at: entity_identity_product.created_at,
        updated_at: entity_identity_product.updated_at,
      };

      entity_connect_product.should.be.eql(expect_connect_results);
      entity_credit_score_product.should.be.eql(expect_credit_score_results);
      entity_identity_product.should.be.eql(expect_identity_results);
    });
  });

  describe('entities.subscriptions', () => {
    it('should create a subscription for an entity', async () => {
      entities_create_connect_subscription_response = await client.entities(entities_create_response?.id || '').subscriptions.create({
        enroll: [ 'connect' ],
      });
      entities_create_credit_score_subscription_response = await client.entities(entities_create_response?.id || '').subscriptions.create({
        enroll: [ 'credit_score' ],
      });

      const expect_connect_results = {
        connect: {
          subscription: {
            id: entities_create_connect_subscription_response.connect?.subscription?.id,
            name: 'connect',
            status: 'active',
            latest_request_id: null,
            created_at: entities_create_connect_subscription_response.connect?.subscription?.created_at,
            updated_at: entities_create_connect_subscription_response.connect?.subscription?.updated_at,
          }
        }
      };

      const expect_credit_score_results = {
        credit_score: {
          subscription: {
            id: entities_create_credit_score_subscription_response.credit_score?.subscription?.id,
            name: 'credit_score',
            status: 'active',
            latest_request_id: null,
            created_at: entities_create_credit_score_subscription_response.credit_score?.subscription?.created_at,
            updated_at: entities_create_credit_score_subscription_response.credit_score?.subscription?.updated_at,
          }
        },
      };

      entities_create_connect_subscription_response.should.be.eql(expect_connect_results, 'connect');
      entities_create_credit_score_subscription_response.should.be.eql(expect_credit_score_results, 'credit_score');
    });

    it('should retrieve a subscription for an entity', async () => {
      const entities_connect_subscription_response = await client.entities(entities_create_response?.id || '').subscriptions.retrieve(entities_create_connect_subscription_response?.connect?.subscription?.id || '');
      const entities_credit_score_subscription_response = await client.entities(entities_create_response?.id || '').subscriptions.retrieve(entities_create_credit_score_subscription_response?.credit_score?.subscription?.id || '');

      const expect_connect_results = {
        id: entities_create_connect_subscription_response?.connect?.subscription?.id,
        name: 'connect',
        status: 'active',
        latest_request_id: null,
        created_at: entities_connect_subscription_response?.created_at,
        updated_at: entities_connect_subscription_response?.updated_at,
      };

      const expect_credit_score_results = {
        id: entities_create_credit_score_subscription_response?.credit_score?.subscription?.id,
        name: 'credit_score',
        status: 'active',
        latest_request_id: null,
        created_at: entities_credit_score_subscription_response?.created_at,
        updated_at: entities_credit_score_subscription_response?.updated_at,
      }
        

      entities_connect_subscription_response.should.be.eql(expect_connect_results);
      entities_credit_score_subscription_response.should.be.eql(expect_credit_score_results);
    });

    it('should list subscriptions for an entity', async () => {
      const entities_subscription_list_response = await client.entities(entities_create_response?.id || '').subscriptions.list();

      const expect_results = {
        connect: {
          id: entities_create_connect_subscription_response?.connect?.subscription?.id,
          name: 'connect',
          status: 'active',
          latest_request_id: null,
          created_at: entities_subscription_list_response?.connect?.created_at,
          updated_at: entities_subscription_list_response?.connect?.updated_at,
        },
        credit_score: {
          id: entities_create_credit_score_subscription_response?.credit_score?.subscription?.id,
          name: 'credit_score',
          status: 'active',
          latest_request_id: null,
          created_at: entities_subscription_list_response?.credit_score?.created_at,
          updated_at: entities_subscription_list_response?.credit_score?.updated_at,
        }
      };

      entities_subscription_list_response.should.be.eql(expect_results);
    });

    it('should delete a subscription for an entity', async () => {
      const entities_subscription_delete_response = await client.entities(entities_create_response?.id || '').subscriptions.delete(entities_create_connect_subscription_response?.connect?.subscription?.id || '');

      const expect_results = {
        id: entities_create_connect_subscription_response?.connect?.subscription?.id,
        name: 'connect',
        status: 'inactive',
        latest_request_id: null,
        created_at: entities_subscription_delete_response?.created_at,
        updated_at: entities_subscription_delete_response?.updated_at,
      };
      
      entities_subscription_delete_response.should.be.eql(expect_results);
    });
  });

  describe('entities.verification_sessions', () => {
    it('should create a verification session for an entity', async () => {
      const entitiy_to_verify = await client.entities.create({
        type: 'individual',
        individual: {
          first_name: 'Kevin',
          last_name: 'Doyle',
          dob: '1930-03-11',
          phone: '+15121231111',
        },
      });

      entities_create_verification_session_response = await client.entities(entitiy_to_verify?.id || '').verificationSessions.create({
        type: 'phone',
        method: 'sms',
        sms: {},
      });

      console.log(entities_create_verification_session_response);

      const expect_results = {
        id: entities_create_verification_session_response?.id,
        entity_id: entitiy_to_verify?.id,
        status: 'pending',
        error: null,
        created_at: entities_create_verification_session_response?.created_at,
        updated_at: entities_create_verification_session_response?.updated_at,
      };

      entities_create_verification_session_response.should.be.eql(expect_results);
    });
  });
});
