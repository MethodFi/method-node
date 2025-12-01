import { should, expect } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { awaitResults } from '../utils';
import type { IEntity, IEntityConnect } from '../../src/resources/Entity';
import {
  type IAccount,
  type IAccountBalance,
  type IAccountCardBrand,
  type IAccountPayoff,
  type IAccountSensitive,
  type IAccountTransaction,
  type IAccountSubscription,
  type IAccountSubscriptionsResponse,
  type IAccountVerificationSession,
  type IAccountUpdate,
  type TAccountProducts,
  type IAccountAttributes,
  type IAccountProduct,
  type IAccountProductListResponse,
  type IAccountPaymentInstrument,
} from '../../src/resources/Account';
import { IResponse } from '../../src/configuration';

should();

describe('Accounts - core methods tests', () => {
  let holder_1_response: IResponse<IEntity>;
  let holder_connect_response: IResponse<IEntityConnect>;
  let accounts_create_ach_response: IResponse<IAccount>;
  let accounts_create_liability_response: IResponse<IAccount>;
  let accounts_retrieve_response: IResponse<IAccount>;
  let accounts_list_response: IResponse<IAccount>[];
  let balances_create_response: IResponse<IAccountBalance>;
  let test_credit_card_account: IResponse<IAccount>;
  let test_credit_card_account_2: IResponse<IAccount>;
  let test_auto_loan_account: IResponse<IAccount>;
  let card_create_response: IResponse<IAccountCardBrand>;
  let payoff_create_response: IResponse<IAccountPayoff>;
  let verification_session_create: IResponse<IAccountVerificationSession>;
  let verification_session_update: IResponse<IAccountVerificationSession>;
  let sensitive_data_response: IResponse<IAccountSensitive>;
  let transactions_response: IResponse<IAccountTransaction>;
  let create_txn_subscriptions_response: IResponse<IAccountSubscription>;
  let create_update_subscriptions_response: IResponse<IAccountSubscription>;
  let create_update_snapshot_subscriptions_response: IResponse<IAccountSubscription>;
  let create_updates_response: IResponse<IAccountUpdate>;
  let create_attributes_response: IResponse<IAccountAttributes>;
  let accounts_retrieve_product_list_response: IAccountProductListResponse;

  before(async () => {
    holder_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Test',
        last_name: 'McTesterson',
        phone: '+15121231111'
      }
    });

    await client.entities(holder_1_response.id).verificationSessions.create({
      type: 'phone',
      method: 'byo_sms',
      byo_sms: {
        timestamp: '2021-09-01T00:00:00.000Z',
      },
    });

    await client.entities(holder_1_response.id).verificationSessions.create({
      type: 'identity',
      method: 'kba',
      kba: {},
    });

    holder_connect_response = await client.entities(holder_1_response.id).connect.create();
    
    test_credit_card_account = (await client.accounts.list({
      holder_id: holder_1_response.id,
      "liability.type": 'credit_card',
      "liability.mch_id": "mch_302086",
      "status": "active",
    }))[0];

    test_credit_card_account_2 = (await client.accounts.list({
      holder_id: holder_1_response.id,
      "liability.type": 'credit_card',
      "liability.mch_id": "mch_311289",
      "status": "active",
    }))[0];

    test_auto_loan_account = (await client.accounts.list({
      holder_id: holder_1_response.id,
      "liability.type": 'auto_loan',
      "liability.mch_id": "mch_311130",
      "status": "active",
    }))[0];
  });

  describe('accounts.create', () => {
    it('should successfully create an `ach` account.', async () => {
      accounts_create_ach_response = await client.accounts.create({
        holder_id: holder_1_response.id,
        ach: {
          routing: '062103000',
          number: '123456789',
          type: 'checking',
        },
      });

      const expect_results: IAccount = {
        id: accounts_create_ach_response.id,
        holder_id: holder_1_response.id,
        type: 'ach',
        ach: { routing: '062103000', number: '123456789', type: 'checking' },
        latest_verification_session: accounts_create_ach_response.latest_verification_session,
        products: [ 'payment' ],
        restricted_products: [],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [],
        status: 'active',
        error: null,
        metadata: null,
        created_at: accounts_create_ach_response.created_at,
        updated_at: accounts_create_ach_response.updated_at
      };

      accounts_create_ach_response.should.be.eql(expect_results);
    });

    it('should successfully create a `liability` account.', async () => {
      accounts_create_liability_response = await client.accounts.create({
        holder_id: holder_1_response.id,
        liability: {
          mch_id: 'mch_302086',
          account_number: '4936494462408721',
        },
      });

      accounts_create_liability_response.products.sort();

      const expect_results: IAccount = {
        id: accounts_create_liability_response.id,
        holder_id: holder_1_response.id,
        type: 'liability',
        liability: {
          fingerprint: null,
          mch_id: 'mch_302086',
          mask: '8721',
          ownership: 'unknown',
          type: 'credit_card',
          sub_type: 'flexible_spending',
          name: 'Chase Sapphire Reserve'
        },
        latest_verification_session: accounts_create_liability_response.latest_verification_session,
        balance: null,
        attribute: null,
        update: accounts_create_liability_response.update,
        card_brand: null,
        products: accounts_create_liability_response.products,
        restricted_products: accounts_create_liability_response.restricted_products,
        subscriptions: accounts_create_liability_response.subscriptions,
        available_subscriptions: [ 'update' ],
        restricted_subscriptions: [],
        status: 'active',
        error: null,
        metadata: null,
        payment_instrument: null,
        payoff: null,
        created_at: accounts_create_liability_response.created_at,
        updated_at: accounts_create_liability_response.updated_at
      };

      accounts_create_liability_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.retrieve', () => {
    it('should successfully retrieve an account by id.', async () => {
      accounts_retrieve_response = await client.accounts.retrieve(accounts_create_ach_response.id);

      const expect_results: IAccount = {
        id: accounts_create_ach_response.id,
        holder_id: holder_1_response.id,
        type: 'ach',
        ach: {
          routing: '062103000',
          number: '123456789',
          type: 'checking'
        },
        latest_verification_session: accounts_create_ach_response.latest_verification_session,
        products: [ 'payment' ],
        restricted_products: [],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [],
        status: 'active',
        error: null,
        metadata: null,
        created_at: accounts_create_ach_response.created_at,
        updated_at: accounts_retrieve_response.updated_at
      };
      
      accounts_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.list', () => {
    it('should successfully list accounts.', async () => {
      accounts_list_response = await client.accounts.list({
        holder_id: holder_1_response.id,
        type: 'liability',
        status: 'active',
      });

      const account_ids = accounts_list_response
        .map(account => account.id)
        .filter(acc_id => acc_id !== accounts_create_liability_response.id)
        .sort((a, b) => a < b ? 1 : -1)
        .slice(0, holder_connect_response.accounts?.length);
      
      const connect_acc_ids = holder_connect_response.accounts?.sort((a, b) => a < b ? 1 : -1) || [ 'no_data' ];
      const dupes = [...account_ids, ...connect_acc_ids];
      const test_length = Array.from(new Set(dupes)).length;

      accounts_list_response.should.be.not.null;
      Array.isArray(accounts_list_response).should.be.true;
      test_length.should.be.eql(connect_acc_ids.length);
    });
  });
  
  describe('accounts.balances', () => {
    it('should successfully create a request to get the balance of an account.', async () => {
      balances_create_response = await client
        .accounts(test_credit_card_account.id)
        .balances
        .create();

      const expect_results: IAccountBalance = {
        id: balances_create_response.id,
        account_id: test_credit_card_account.id,
        status: 'pending',
        amount: null,
        error: null,
        created_at: balances_create_response.created_at,
        updated_at: balances_create_response.updated_at
      };

      balances_create_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve the balance of an account.', async () => {
      const account_balances_response = async () => {
        return await client
          .accounts(test_credit_card_account.id)
          .balances
          .retrieve(balances_create_response.id);
      };

      const account_balances = await awaitResults(account_balances_response);

      const expect_results: IAccountBalance = {
        id: balances_create_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        amount: 1866688,
        error: null,
        created_at: balances_create_response.created_at,
        updated_at: account_balances.updated_at
      };

      account_balances.should.be.eql(expect_results);
    });

    it('should successfully list balances for an account.', async () => {
      const account_balances = await client
        .accounts(test_credit_card_account.id)
        .balances
        .list();

      const expect_results = {
        id: balances_create_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        amount: 1866688,
        error: null,
        created_at: account_balances[0].created_at,
        updated_at: account_balances[0].updated_at
      };

      account_balances[0].should.be.eql(expect_results);
    });
  });

  describe('accounts.cardBrands', () => {
    it('should successfully create a card for an account.', async () => {
      // @ts-ignore
      card_create_response = await client
        .accounts(test_credit_card_account.id)
        .cardBrands
        .create();

      const expect_results: IAccountCardBrand = {
        id: card_create_response.id,
        account_id: test_credit_card_account.id,
        brands: [],
        status: 'in_progress',
        shared: false,
        source: null,
        error: null,
        created_at: card_create_response.created_at,
        updated_at: card_create_response.updated_at
      }

      card_create_response.should.be.eql(expect_results);
      await new Promise(r => setTimeout(r, 2000))
    });

    it('should successfully retrieve a card for an account.', async () => {
      // @ts-ignore
      const cardRetrieveResponse = async () => {
        return await client
        .accounts(test_credit_card_account.id)
        .cardBrands
        .retrieve(card_create_response.id);
      };

      const card_retrieve_response = await awaitResults(cardRetrieveResponse);

      expect(card_retrieve_response.id).to.equal(card_create_response.id);
      expect(card_retrieve_response.account_id).to.equal(test_credit_card_account.id);
      expect(card_retrieve_response.status).to.equal('completed');
      expect(card_retrieve_response.source).to.equal('network');
      expect(card_retrieve_response.error).to.be.null;
      expect(card_retrieve_response.created_at).to.be.a('string');
      expect(card_retrieve_response.updated_at).to.be.a('string');

      const brand = card_retrieve_response.brands?.[0];
      expect(brand).to.exist;
      expect(brand.id).to.equal('pdt_15_brd_1');
      expect(brand.card_product_id).to.equal('pdt_15');
      expect(brand.description).to.equal('Chase Sapphire Reserve');
      expect(brand.name).to.equal('Chase Sapphire Reserve');
      expect(brand.issuer).to.equal('Chase');
      expect(brand.network).to.equal('visa');
      expect(brand.type).to.equal('specific');
      expect(brand.url).to.equal('https://static.methodfi.com/card_brands/1b7ccaba6535cb837f802d968add4700.png');
    });

    it('should successfully list card brands for an account.', async () => {
      const card_brands = await client
        .accounts(test_credit_card_account.id)
        .cardBrands
        .list();

      const result = card_brands[0];

      expect(result.id).to.equal(card_create_response.id);
      expect(result.account_id).to.equal(test_credit_card_account.id);
      expect(result.status).to.equal('completed');
      expect(result.source).to.equal('network');
      expect(result.error).to.be.null;
      expect(result.created_at).to.be.a('string');
      expect(result.updated_at).to.be.a('string');
      
      const brand = result.brands?.[0];
      expect(brand).to.exist;
      expect(brand.id).to.equal('pdt_15_brd_1');
      expect(brand.card_product_id).to.equal('pdt_15');
      expect(brand.description).to.equal('Chase Sapphire Reserve');
      expect(brand.name).to.equal('Chase Sapphire Reserve');
      expect(brand.issuer).to.equal('Chase');
      expect(brand.network).to.equal('visa');
      expect(brand.type).to.equal('specific');
      expect(brand.url).to.equal('https://static.methodfi.com/card_brands/1b7ccaba6535cb837f802d968add4700.png');
    });
  });

  describe('accounts.payoffs', () => {
    it('should successfully create a payoff request for an account.', async () => {
      payoff_create_response = await client
        .accounts(test_auto_loan_account.id)
        .payoffs
        .create();

      const expect_results: IAccountPayoff = {
        id: payoff_create_response.id,
        account_id: test_auto_loan_account.id,
        amount: null,
        per_diem_amount: null,
        term: null,
        status: 'pending',
        error: null,
        created_at: payoff_create_response.created_at,
        updated_at: payoff_create_response.updated_at
      };

      payoff_create_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve a payoff for an account.', async () => {
      const payoff_quote_response = async () => {
        return await client
        .accounts(test_auto_loan_account.id)
        .payoffs
        .retrieve(payoff_create_response.id);
      };

      const payoff_quote = await awaitResults(payoff_quote_response);

      const expect_results: IAccountPayoff = {
        id: payoff_create_response.id,
        account_id: test_auto_loan_account.id,
        amount: 6083988,
        per_diem_amount: null,
        term: 15,
        status: 'completed',
        error: null,
        created_at: payoff_quote.created_at,
        updated_at: payoff_quote.updated_at
      };

      payoff_quote.should.be.eql(expect_results);
    });

    it('should successfully list payoffs for an account.', async () => {
      const payoffs = await client
        .accounts(test_auto_loan_account.id)
        .payoffs
        .list();

      const expect_results = {
        id: payoff_create_response.id,
        account_id: test_auto_loan_account.id,
        amount: 6083988,
        per_diem_amount: null,
        term: 15,
        status: 'completed',
        error: null,
        created_at: payoffs[0].created_at,
        updated_at: payoffs[0].updated_at
      };

      payoffs[0].should.be.eql(expect_results);
    });
  });

  describe('accounts.verificationSessions', () => {
    it('should successfully create a verification session for an account.', async () => {
      verification_session_create = await client
        .accounts(test_credit_card_account.id)
        .verificationSessions
        .create({
          type: 'pre_auth'
        });

        const expect_results: IAccountVerificationSession = {
          id: verification_session_create.id,
          account_id: test_credit_card_account.id,
          status: 'pending',
          type: 'pre_auth',
          error: null,
          pre_auth: {
            billing_zip_code: 'xxxxx',
            billing_zip_code_check: null,
            cvv: null,
            cvv_check: null,
            exp_check: null,
            exp_month: 'xx',
            exp_year: 'xxxx',
            number: 'xxxxxxxxxxxxxxxx',
            pre_auth_check: null
          },
          created_at: verification_session_create.created_at,
          updated_at: verification_session_create.updated_at
        };
  
        verification_session_create.should.be.eql(expect_results);
    });

    it('should successfully update a verification session for an account.', async () => {

      verification_session_update = await client
        .accounts(test_credit_card_account.id)
        .verificationSessions
        .update(verification_session_create.id, {
          pre_auth: {
            exp_month: '03',
            exp_year: '2028',
            billing_zip_code: '78758',
            cvv: '878'
          }  
        });

      const expect_results: IAccountVerificationSession = {
        id: verification_session_update.id,
        account_id: test_credit_card_account.id,
        status: 'verified',
        type: 'pre_auth',
        error: null,
        pre_auth: {
          billing_zip_code: 'xxxxx',
          billing_zip_code_check: 'pass',
          cvv: 'xxx',
          cvv_check: 'pass',
          exp_check: "pass",
          exp_month: "xx",
          exp_year: "xxxx",
          number: "xxxxxxxxxxxxxxxx",
          pre_auth_check: "pass"
        },
        created_at: verification_session_update.created_at,
        updated_at: verification_session_update.updated_at
      };

      verification_session_update.should.be.eql(expect_results);
    });

    it('should successfully retrieve a verification session for an account.', async () => {
      const verification_session = await client
        .accounts(test_credit_card_account.id)
        .verificationSessions
        .retrieve(verification_session_update.id);

      const expect_results: IAccountVerificationSession = {
        id: verification_session_update.id,
        account_id: test_credit_card_account.id,
        status: 'verified',
        type: 'pre_auth',
        error: null,
        pre_auth: {
          billing_zip_code: 'xxxxx',
          billing_zip_code_check: 'pass',
          cvv: 'xxx',
          cvv_check: 'pass',
          exp_check: "pass",
          exp_month: "xx",
          exp_year: "xxxx",
          number: "xxxxxxxxxxxxxxxx",
          pre_auth_check: "pass"
        },
        created_at: verification_session.created_at,
        updated_at: verification_session.updated_at
      };

      verification_session.should.be.eql(expect_results);
    });

    it('should successfully list verification sessions for an account.', async () => {
      const verification_sessions = await client
        .accounts(test_credit_card_account.id)
        .verificationSessions
        .list();

      const expect_results: IAccountVerificationSession = {
        id: verification_session_update.id,
        account_id: test_credit_card_account.id,
        status: 'verified',
        type: 'pre_auth',
        error: null,
        pre_auth: {
          billing_zip_code: 'xxxxx',
          billing_zip_code_check: 'pass',
          cvv: 'xxx',
          cvv_check: 'pass',
          exp_check: "pass",
          exp_month: "xx",
          exp_year: "xxxx",
          number: "xxxxxxxxxxxxxxxx",
          pre_auth_check: "pass"
        },
        created_at: verification_sessions[0].created_at,
        updated_at: verification_sessions[0].updated_at
      };

      verification_sessions[0].should.be.eql(expect_results);
    });
  });

  describe('accounts.sensitive', () => {
    it('should successfully create a request to get sensitive data for an account.', async () => {
      sensitive_data_response = await client
        .accounts(test_credit_card_account.id)
        .sensitive
        .create({ expand: [
          'credit_card.number',
          'credit_card.exp_month',
          'credit_card.exp_year'
        ] 
      });

        const expect_results: IAccountSensitive = {
          id: sensitive_data_response.id,
          account_id: test_credit_card_account.id,
          type: 'credit_card',
          credit_card: {
            billing_zip_code: null,
            number: '5555555555551580',
            exp_month: '03',
            exp_year: '2028',
            cvv: null
          },
          status: 'completed',
          error: null,
          created_at: sensitive_data_response.created_at,
          updated_at: sensitive_data_response.updated_at
        };

      sensitive_data_response.should.be.eql(expect_results);
    });

    it('should successfully list sensitive data for an account.', async () => {
      const sensitive_data = await client
        .accounts(test_credit_card_account.id)
        .sensitive
        .list();

      sensitive_data[0].should.be.eql(sensitive_data_response);
    });
  });

  describe('accounts.subscriptions', () => {
    it('should successfully create a transactions subscription.', async () => {
      const network_verification_session = await client
      .accounts(test_credit_card_account_2.id)
      .verificationSessions
      .create({
        type: 'network'
      });

      await client
        .accounts(test_credit_card_account_2.id)
        .verificationSessions
        .update(network_verification_session.id, {
          network: {
            exp_month: '09',
            exp_year: '2028',
            billing_zip_code: '78758',
            cvv: '539'
          }  
      });

      create_txn_subscriptions_response = await client
        .accounts(test_credit_card_account_2.id)
        .subscriptions
        .create('transaction');

      const expect_results: IAccountSubscription = {
        id: create_txn_subscriptions_response.id,
        name: 'transaction',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: create_txn_subscriptions_response.created_at,
        updated_at: create_txn_subscriptions_response.updated_at
      };

      create_txn_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully create an update subscription', async () => {
      create_update_subscriptions_response = await client
        .accounts(test_credit_card_account.id)
        .subscriptions
        .create('update');

      const expect_results: IAccountSubscription = {
        id: create_update_subscriptions_response.id,
        name: 'update',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: create_update_subscriptions_response.created_at,
        updated_at: create_update_subscriptions_response.updated_at
      };

      create_update_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully create an update.snapshot subscription.', async () => {
      create_update_snapshot_subscriptions_response = await client
        .accounts(test_auto_loan_account.id)
        .subscriptions
        .create('update.snapshot');

      const expect_results: IAccountSubscription = {
        id: create_update_snapshot_subscriptions_response.id,
        name: 'update.snapshot',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: create_update_snapshot_subscriptions_response.created_at,
        updated_at: create_update_snapshot_subscriptions_response.updated_at
      };

      create_update_snapshot_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully list subscriptions.', async () => {
      const subscriptions_response = await client
        .accounts(test_credit_card_account.id)
        .subscriptions
        .list();

      const subscriptions_update_snapshot_response = await client
        .accounts(test_auto_loan_account.id)
        .subscriptions
        .list();
      
      const subscriptions_transactions_response = await client
        .accounts(test_credit_card_account_2.id)
        .subscriptions
        .list();

      const expect_results_card: IAccountSubscriptionsResponse = {
        update: {
          id: create_update_subscriptions_response.id,
          name: 'update',
          status: 'active',
          payload: null,
          latest_request_id: null,
          created_at: subscriptions_response.update?.created_at || '',
          updated_at: subscriptions_response.update?.updated_at || ''
        }
      };

      const expect_results_transactions: IAccountSubscriptionsResponse = {
        transaction: {
          id: create_txn_subscriptions_response.id,
          name: 'transaction',
          status: 'active',
          payload: null,
          latest_request_id: null,
          created_at: subscriptions_transactions_response.transaction?.created_at || '',
          updated_at: subscriptions_transactions_response.transaction?.updated_at || ''
        }
      };

      const expect_results_snapshot: IAccountSubscriptionsResponse = {
        'update.snapshot': {
          id: create_update_snapshot_subscriptions_response.id,
          name: 'update.snapshot',
          status: 'active',
          payload: null,
          latest_request_id: null,
          created_at: subscriptions_update_snapshot_response['update.snapshot']?.created_at || '',
          updated_at: subscriptions_update_snapshot_response['update.snapshot']?.updated_at || ''
        }
      };

      subscriptions_response.should.be.eql(expect_results_card);
      subscriptions_update_snapshot_response.should.be.eql(expect_results_snapshot);
      subscriptions_transactions_response.should.be.eql(expect_results_transactions);
    });

    it('should successfully retrieve a transactions subscription.', async () => {
      const retrieve_subscriptions_response = await client
        .accounts(test_credit_card_account_2.id)
        .subscriptions
        .retrieve(create_txn_subscriptions_response.id);

      const expect_results: IAccountSubscription = {
        id: create_txn_subscriptions_response.id,
        name: 'transaction',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: retrieve_subscriptions_response.created_at,
        updated_at: retrieve_subscriptions_response.updated_at
      };

      retrieve_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve an update subscription.', async () => {
      const retrieve_subscriptions_response = await client
        .accounts(test_credit_card_account.id)
        .subscriptions
        .retrieve(create_update_subscriptions_response.id);

      const expect_results: IAccountSubscription = {
        id: create_update_subscriptions_response.id,
        name: 'update',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: retrieve_subscriptions_response.created_at,
        updated_at: retrieve_subscriptions_response.updated_at
      };

      retrieve_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve an update.snapshot subscription.', async () => {
      const retrieve_subscriptions_response = await client
        .accounts(test_auto_loan_account.id)
        .subscriptions
        .retrieve(create_update_snapshot_subscriptions_response.id);

      const expect_results: IAccountSubscription = {
        id: create_update_snapshot_subscriptions_response.id,
        name: 'update.snapshot',
        status: 'active',
        payload: null,
        latest_request_id: null,
        created_at: retrieve_subscriptions_response.created_at,
        updated_at: retrieve_subscriptions_response.updated_at
      };

      retrieve_subscriptions_response.should.be.eql(expect_results);
    });

    it('should successfully delete a subscription.', async () => {
      const delete_subscriptions_response = await client
        .accounts(test_auto_loan_account.id)
        .subscriptions
        .delete(create_update_snapshot_subscriptions_response.id);

      const expect_results: IAccountSubscription = {
        id: create_update_snapshot_subscriptions_response.id,
        name: 'update.snapshot',
        status: 'inactive',
        payload: null,
        latest_request_id: null,
        created_at: delete_subscriptions_response.created_at,
        updated_at: delete_subscriptions_response.updated_at
      };

      delete_subscriptions_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.transactions', () => {
    it('should successfully list transactions for an account.', async () => {      
      const { amount, descriptor, transacted_at, posted_at } = await client.simulate.accounts(test_credit_card_account_2.id).transactions.create();
      const res = await client
        .accounts(test_credit_card_account_2.id)
        .transactions
        .list();

      transactions_response = res[0];

      const expect_results: IAccountTransaction = {
        id: transactions_response.id,
        account_id: test_credit_card_account_2.id,
        status: 'posted',
        descriptor,
        amount,
        auth_amount: transactions_response.auth_amount,
        currency_code: 'USD',
        transaction_amount: transactions_response.transaction_amount,
        transaction_auth_amount: transactions_response.transaction_auth_amount,
        transaction_currency_code: 'USD',
        merchant_category_code: '5182',
        merchant: transactions_response.merchant,
        transacted_at,
        posted_at,
        voided_at: null,
        original_txn_id: null,
        created_at: transactions_response.created_at,
        updated_at: transactions_response.updated_at
      };

      transactions_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve a transaction for an account.', async () => {
      const retrieve_transaction_response = await client
        .accounts(test_credit_card_account_2.id)
        .transactions
        .retrieve(transactions_response.id);

      const expect_results: IAccountTransaction = {
        id: transactions_response.id,
        account_id: test_credit_card_account_2.id,
        status: 'posted',
        descriptor: retrieve_transaction_response.descriptor,
        amount: retrieve_transaction_response.amount,
        auth_amount: retrieve_transaction_response.auth_amount,
        currency_code: 'USD',
        transaction_amount: retrieve_transaction_response.transaction_amount,
        transaction_auth_amount: retrieve_transaction_response.transaction_auth_amount,
        transaction_currency_code: 'USD',
        merchant_category_code: '5182',
        merchant: retrieve_transaction_response.merchant,
        transacted_at: retrieve_transaction_response.transacted_at,
        posted_at: retrieve_transaction_response.posted_at,
        voided_at: null,
        original_txn_id: null,
        created_at: retrieve_transaction_response.created_at,
        updated_at: retrieve_transaction_response.updated_at
      };

      retrieve_transaction_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.updates', () => {
    it('should successfully create an updates request', async () => {
      create_updates_response = await client.accounts(test_credit_card_account.id).updates.create();
      
      const expect_results: IAccountUpdate = {
        id: create_updates_response.id,
        account_id: test_credit_card_account.id,
        status: 'pending',
        source: 'direct',
        type: 'credit_card',
        credit_card: {
          sub_type: null,
          opened_at: null,
          closed_at: null,
          balance: null,
          last_payment_amount: null,
          last_payment_date: null,
          next_payment_due_date: null,
          next_payment_minimum_amount: null,
          interest_rate_type: null,
          interest_rate_percentage_max: null,
          interest_rate_percentage_min: null,
          available_credit: null,
          credit_limit: null,
          usage_pattern: null
        },
        data_as_of: null,
        error: null,
        created_at: create_updates_response.created_at,
        updated_at: create_updates_response.updated_at
      };

      create_updates_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve results of an updates request', async () => {
      const getAccountUpdates = async () => {
        return await client
        .accounts(test_credit_card_account.id)
        .updates
        .retrieve(create_updates_response.id);
      };

      const retrieve_updates_response = await awaitResults(getAccountUpdates);

      const expect_results: IAccountUpdate = {
        id: create_updates_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        source: 'direct',
        type: 'credit_card',
        credit_card: {
          sub_type: 'flexible_spending',
          opened_at: '2016-12-20',
          closed_at: null,
          balance: 1866688,
          last_payment_amount: 100000,
          last_payment_date: '2023-01-04',
          next_payment_due_date: '2023-02-09',
          next_payment_minimum_amount: 51060,
          interest_rate_type: 'variable',
          interest_rate_percentage_max: 27.5,
          interest_rate_percentage_min: 20.5,
          available_credit: 930000,
          credit_limit: 2800000,
          usage_pattern: null
        },
        data_as_of: retrieve_updates_response.data_as_of,
        error: null,
        created_at: retrieve_updates_response.created_at,
        updated_at: retrieve_updates_response.updated_at
      };

      retrieve_updates_response.should.be.eql(expect_results);
    });

    it('should successfully list updates for an account.', async () => {
      const list_updates_response = await client.accounts(test_credit_card_account.id).updates.list();
      
      const update_to_check = list_updates_response.find(update => update.id === create_updates_response.id);

      const expect_results: IAccountUpdate = {
          id: create_updates_response.id,
          account_id: test_credit_card_account.id,
          status: 'completed',
          source: 'direct',
          type: 'credit_card',
          credit_card: {
            sub_type: 'flexible_spending',
            opened_at: '2016-12-20',
            closed_at: null,
            balance: 1866688,
            last_payment_amount: 100000,
            last_payment_date: '2023-01-04',
            next_payment_due_date: '2023-02-09',
            next_payment_minimum_amount: 51060,
            interest_rate_type: 'variable',
            interest_rate_percentage_max: 27.5,
            interest_rate_percentage_min: 20.5,
            available_credit: 930000,
            credit_limit: 2800000,
            usage_pattern: null
          },
          data_as_of: update_to_check?.data_as_of || null,
          error: null,
          created_at: update_to_check?.created_at || '',
          updated_at: update_to_check?.updated_at || ''
        };

      update_to_check?.should.be.eql(expect_results);
    });
  });

  describe('accounts.attributes', () => {
    it('should successfully create an attributes request', async () => {
      create_attributes_response = await client.accounts(test_credit_card_account.id).attributes.create();

      const expect_results: IAccountAttributes = {
        id: create_attributes_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        attributes: create_attributes_response.attributes,
        error: null,
        created_at: create_attributes_response.created_at,
        updated_at: create_attributes_response.updated_at
      };

      create_attributes_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve an attributes request', async () => {
      const retrieve_attributes_response = await client.accounts(test_credit_card_account.id).attributes.retrieve(create_attributes_response.id);

      const expect_results: IAccountAttributes = {
        id: create_attributes_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        attributes: create_attributes_response.attributes,
        error: null,
        created_at: retrieve_attributes_response.created_at,
        updated_at: retrieve_attributes_response.updated_at
      };

      retrieve_attributes_response.should.be.eql(expect_results);
    });

    it('should successfully list attributes for an account', async () => {
      const list_attributes_response = await client.accounts(test_credit_card_account.id).attributes.list();
      
      const expect_results: IAccountAttributes = {
        id: create_attributes_response.id,
        account_id: test_credit_card_account.id,
        status: 'completed',
        attributes: create_attributes_response.attributes,
        error: null,
        created_at: list_attributes_response[0].created_at,
        updated_at: list_attributes_response[0].updated_at
      };

      list_attributes_response[0].should.be.eql(expect_results);
    });
  });

  describe('accounts.products', () => {
    let accounts_retrieve_product_list_response: IAccountProductListResponse;

    it('should successfully list products for an account', async () => {
      accounts_retrieve_product_list_response = await client
        .accounts(test_credit_card_account.id)
        .products.list();

      const expect_results: IAccountProductListResponse = {
        balance: {
          name: 'balance',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.balance?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.balance?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response.balance?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.balance?.updated_at || ''
        },
        payment: {
          name: 'payment',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.payment?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.payment?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response.payment?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.payment?.updated_at || ''
        },
        sensitive: {
          name: 'sensitive',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.sensitive?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.sensitive?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response.sensitive?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.sensitive?.updated_at || ''
        },
        update: {
          name: 'update',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.update?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.update?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at: accounts_retrieve_product_list_response.update?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.update?.updated_at || ''
        },
        attribute: {
          name: 'attribute',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.attribute?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.attribute?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response.attribute?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.attribute?.updated_at || ''
        },
        transaction: {
          name: 'transaction',
          status: 'unavailable',
          status_error: accounts_retrieve_product_list_response.transaction?.status_error || null,
          latest_request_id: accounts_retrieve_product_list_response.transaction?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.transaction?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at: accounts_retrieve_product_list_response.transaction?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.transaction?.updated_at || ''
        },
        card_brand: {
          name: 'card_brand',
          status: 'available',
          status_error: null,
          latest_request_id: accounts_retrieve_product_list_response.card_brand?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.card_brand?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at: accounts_retrieve_product_list_response.card_brand?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.card_brand?.updated_at || ''
        },
        payoff: {
          name: 'payoff',
          status: 'unavailable',
          status_error: accounts_retrieve_product_list_response.payoff?.status_error || null,
          latest_request_id: accounts_retrieve_product_list_response.payoff?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response.payoff?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response.payoff?.created_at || '',
          updated_at: accounts_retrieve_product_list_response.payoff?.updated_at || ''
        },
        'payment_instrument.card': {
          name: 'payment_instrument.card',
          status: 'restricted',
          status_error: accounts_retrieve_product_list_response['payment_instrument.card']?.status_error || null,
          latest_request_id: accounts_retrieve_product_list_response['payment_instrument.card']?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response['payment_instrument.card']?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at: accounts_retrieve_product_list_response['payment_instrument.card']?.created_at || '',
          updated_at: accounts_retrieve_product_list_response['payment_instrument.card']?.updated_at || ''
        },
        'payment_instrument.inbound_achwire_payment': {
          name: 'payment_instrument.inbound_achwire_payment',
          status: 'restricted',
          status_error: accounts_retrieve_product_list_response['payment_instrument.inbound_achwire_payment']?.status_error || null,
          latest_request_id: accounts_retrieve_product_list_response['payment_instrument.inbound_achwire_payment']?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response['payment_instrument.inbound_achwire_payment']?.latest_successful_request_id || null,
          is_subscribable: false,
          created_at: accounts_retrieve_product_list_response['payment_instrument.inbound_achwire_payment']?.created_at || '',
          updated_at: accounts_retrieve_product_list_response['payment_instrument.inbound_achwire_payment']?.updated_at || ''
        },
        'payment_instrument.network_token': {
          name: 'payment_instrument.network_token',
          status: 'restricted',
          status_error: accounts_retrieve_product_list_response['payment_instrument.network_token']?.status_error || null,
          latest_request_id: accounts_retrieve_product_list_response['payment_instrument.network_token']?.latest_request_id || null,
          latest_successful_request_id: accounts_retrieve_product_list_response['payment_instrument.network_token']?.latest_successful_request_id || null,
          is_subscribable: true,
          created_at: accounts_retrieve_product_list_response['payment_instrument.network_token']?.created_at || '',
          updated_at: accounts_retrieve_product_list_response['payment_instrument.network_token']?.updated_at || ''
        }
      };

      accounts_retrieve_product_list_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.withdrawConsent', () => {
    it('should successfully withdraw consent from an account.', async () => {
      const withdraw_consent_response = await client.accounts.withdrawConsent(test_credit_card_account.id);
      
      const expect_results: IAccount = {
        id: test_credit_card_account.id,
        holder_id: holder_1_response.id,
        status: 'disabled',
        type: null,
        liability: null,
        products: [],
        restricted_products: [],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [],
        error: {
          type: 'ACCOUNT_DISABLED',
          sub_type: 'ACCOUNT_CONSENT_WITHDRAWN',
          code: 11004,
          message: 'Account was disabled due to consent withdrawal.'
        },
        metadata: null,
        created_at: withdraw_consent_response.created_at,
        updated_at: withdraw_consent_response.updated_at
      };

      withdraw_consent_response.should.be.eql(expect_results);
    });
  });
});
