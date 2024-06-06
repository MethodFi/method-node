import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { awaitResults } from '../utils';
import type { IEntity, IEntityConnect } from '../../src/resources/Entity';
import {
  IAccount,
  IAccountBalance,
  IAccountCardBrand,
  IAccountPayoff,
  IAccountSensitive,
  IAccountTransaction,
  IAccountSubscription,
  IAccountSubscriptionsResponse,
  IAccountVerificationSession,
  IAccountUpdate,
  TAccountProducts
} from '../../src/resources/Account';

should();

describe('Accounts - core methods tests', () => {
  let holder_1_response: IEntity;
  let holder_connect_response: IEntityConnect;
  let accounts_create_ach_response: IAccount;
  let accounts_create_liability_response: IAccount;
  let accounts_retrieve_response: IAccount;
  let accounts_list_response: IAccount[];
  let balances_create_response: IAccountBalance;
  let test_credit_card_account: IAccount;
  let test_auto_loan_account: IAccount;
  let card_create_response: IAccountCardBrand;
  let payoff_create_response: IAccountPayoff;
  let verification_session_create: IAccountVerificationSession;
  let verification_session_update: IAccountVerificationSession;
  let sensitive_data_response: IAccountSensitive;
  let transactions_response: IAccountTransaction;
  let create_txn_subscriptions_response: IAccountSubscription;
  let create_update_subscriptions_response: IAccountSubscription;
  let create_update_snapshot_subscriptions_response: IAccountSubscription;
  let create_updates_response: IAccountUpdate;

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
    }))[0];
    
    test_auto_loan_account = (await client.accounts.list({
      holder_id: holder_1_response.id,
      "liability.type": 'auto_loan',
      "liability.mch_id": "mch_2347",
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
          mch_id: 'mch_183',
          mask: '8721',
          ownership: 'unknown',
          type: 'credit_card',
          name: 'Chase Sapphire Reserve'
        },
        latest_verification_session: accounts_create_liability_response.latest_verification_session,
        balance: null,
        update: accounts_create_liability_response.update,
        card_brand: null,
        products: [ 'balance', 'payment', 'sensitive', 'update' ].sort() as TAccountProducts[],
        restricted_products: accounts_create_liability_response.restricted_products,
        subscriptions: accounts_create_liability_response.subscriptions,
        available_subscriptions: [ 'update' ],
        restricted_subscriptions: [],
        status: 'active',
        error: null,
        metadata: null,
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
      const getAccountBalances = async () => {
        return client
          .accounts(test_credit_card_account.id)
          .balances
          .retrieve(balances_create_response.id);
      }

      const account_balances = await awaitResults(getAccountBalances);

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
    // TODO: Add back once this is live in API
    // it('should successfully list balances for an account.', async () => {
    //   const listAccountBalances = async () => {
    //     return client
    //       .accounts(test_credit_card_account.id)
    //       .balances
    //       .list();
    //   };

    //   const account_balances = await awaitResults(listAccountBalances);

    //   const expect_results = {
    //     id: balances_create_response.id,
    //     account_id: test_credit_card_account.id,
    //     status: 'completed',
    //     amount: 1866688,
    //     error: null,
    //     created_at: account_balances[0].created_at,
    //     updated_at: account_balances[0].updated_at
    //   };

    //   account_balances[0].should.be.eql(expect_results);
    // });
  });

  describe('accounts.cardBrands', () => {
    it('should successfully create a card for an account.', async () => {
      card_create_response = await client
        .accounts(test_credit_card_account.id)
        .cardBrands
        .create();

        const expect_results: IAccountCardBrand = {
          id: card_create_response.id,
          account_id: test_credit_card_account.id,
          network: 'visa',
          status: 'completed',
          issuer: null,
          last4: '1580',
          brands: card_create_response.brands,
          shared: false,
          error: null,
          created_at: card_create_response.created_at,
          updated_at: card_create_response.updated_at
        };

      card_create_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve a card for an account.', async () => {
      const card_retrieve_response = await client
        .accounts(test_credit_card_account.id)
        .cardBrands
        .retrieve(card_create_response.id);

      const expect_results: IAccountCardBrand = {
        id: card_create_response.id,
        account_id: test_credit_card_account.id,
        network: 'visa',
        status: 'completed',
        issuer: null,
        last4: '1580',
        brands: card_create_response.brands,
        shared: false,
        error: null,
        created_at: card_retrieve_response.created_at,
        updated_at: card_retrieve_response.updated_at
      };

      card_retrieve_response.should.be.eql(expect_results);
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
      const getPayoffQuotes = async () =>{
        return await client
          .accounts(test_auto_loan_account.id)
          .payoffs
          .retrieve(payoff_create_response.id);
      };

      const payoff_quote = await awaitResults(getPayoffQuotes);

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
    // TODO: Add back once this is live in API
    // it('should successfully list payoffs for an account.', async () => {
    //   const listPayoffQuotes = async () => {
    //     return await client
    //       .accounts(test_auto_loan_account.id)
    //       .payoffs
    //       .list();
    //   };

    //   const payoffs = await awaitResults(listPayoffQuotes);

    //   const expect_results = {
    //     id: payoff_create_response.id,
    //     account_id: test_auto_loan_account.id,
    //     amount: 6083988,
    //     per_diem_amount: null,
    //     term: 15,
    //     status: 'completed',
    //     error: null,
    //     created_at: payoffs[0].created_at,
    //     updated_at: payoffs[0].updated_at
    //   };

    //   payoffs[0].should.be.eql(expect_results);
    // });
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
      const getVerificationSession = async () => {
        return await client
          .accounts(test_credit_card_account.id)
          .verificationSessions
          .retrieve(verification_session_update.id);
      };

      const verification_session = await awaitResults(getVerificationSession);

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
  });

  describe('accounts.subscriptions', () => {
    it('should successfully create a transactions subscription.', async () => {
      create_txn_subscriptions_response = await client
        .accounts(test_credit_card_account.id)
        .subscriptions
        .create('transactions');

      const expect_results: IAccountSubscription = {
        id: create_txn_subscriptions_response.id,
        name: 'transactions',
        status: 'active',
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

      const expect_results_card: IAccountSubscriptionsResponse = {
        transactions: {
          id: create_txn_subscriptions_response.id,
          name: 'transactions',
          status: 'active',
          latest_request_id: null,
          created_at: subscriptions_response.transactions?.created_at || '',
          updated_at: subscriptions_response.transactions?.updated_at || ''
        },
        update: {
          id: create_update_subscriptions_response.id,
          name: 'update',
          status: 'active',
          latest_request_id: null,
          created_at: subscriptions_response.update?.created_at || '',
          updated_at: subscriptions_response.update?.updated_at || ''
        }
      };

      const expect_results_snapshot: IAccountSubscriptionsResponse = {
        'update.snapshot': {
          id: create_update_snapshot_subscriptions_response.id,
          name: 'update.snapshot',
          status: 'active',
          latest_request_id: null,
          created_at: subscriptions_update_snapshot_response['update.snapshot']?.created_at || '',
          updated_at: subscriptions_update_snapshot_response['update.snapshot']?.updated_at || ''
        }
      };

      subscriptions_response.should.be.eql(expect_results_card);
      subscriptions_update_snapshot_response.should.be.eql(expect_results_snapshot);
    });

    it('should successfully retrieve a transactions subscription.', async () => {
      const retrieve_subscriptions_response = await client
        .accounts(test_credit_card_account.id)
        .subscriptions
        .retrieve(create_txn_subscriptions_response.id);

      const expect_results: IAccountSubscription = {
        id: create_txn_subscriptions_response.id,
        name: 'transactions',
        status: 'active',
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
        latest_request_id: null,
        created_at: delete_subscriptions_response.created_at,
        updated_at: delete_subscriptions_response.updated_at
      };

      delete_subscriptions_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.transactions', () => {
    it('should successfully list transactions for an account.', async () => {      
      const { amount, billing_amount, merchant } = await client.simulate.accounts(test_credit_card_account.id).transactions.create();
      const res = await client
        .accounts(test_credit_card_account.id)
        .transactions
        .list();

      transactions_response = res[0];

      const expect_results: IAccountTransaction = {
        id: transactions_response.id,
        account_id: test_credit_card_account.id,
        merchant,
        network: 'visa',
        network_data: null,
        amount,
        currency: 'USD',
        billing_amount,
        billing_currency: 'USD',
        status: 'cleared',
        error: null,
        created_at: transactions_response.created_at,
        updated_at: transactions_response.updated_at
      };

      transactions_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve a transaction for an account.', async () => {
      const retrieve_transaction_response = await client
        .accounts(test_credit_card_account.id)
        .transactions
        .retrieve(transactions_response.id);

      const expect_results: IAccountTransaction = {
        id: transactions_response.id,
        account_id: test_credit_card_account.id,
        merchant: transactions_response.merchant,
        network: 'visa',
        network_data: null,
        amount: transactions_response.amount,
        currency: 'USD',
        billing_amount: transactions_response.billing_amount,
        billing_currency: 'USD',
        status: 'cleared',
        error: null,
        created_at: transactions_response.created_at,
        updated_at: transactions_response.updated_at
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
          error: null,
          created_at: update_to_check?.created_at || '',
          updated_at: update_to_check?.updated_at || ''
        };

      update_to_check?.should.be.eql(expect_results);
    });
  });

  describe('accounts.withdrawConsent', () => {
    it('should successfully withdraw consent from an account.', async () => {
      console.log('test_credit_card_account.id', test_credit_card_account.id);
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
