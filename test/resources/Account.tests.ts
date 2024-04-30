import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { sleep } from '../utils';
import { IEntity } from '../../src/resources/Entity/types';
import { IEntityConnect } from '../../src/resources/Entity/Connect';
import { IAccount } from '../../src/resources/Account/types';
import { IAccountBalance } from '../../src/resources/Account/Balances';
import { IAccountCard } from '../../src/resources/Account/Cards';
import { IAccountPayoff } from '../../src/resources/Account/Payoffs';
import { AccountSensitiveFields, IAccountSensitive, TAccountSensitiveFields } from '../../src/resources/Account/Sensitive';
import { IAccountVerificationSession } from '../../src/resources/Account/VerificationSessions';

should();

describe.only('Accounts - core methods tests', () => {
  let holder_1_response: IEntity | null = null;
  let holder_connect_response: IEntityConnect | null = null;
  let accounts_create_ach_response: IAccount | null = null;
  let accounts_create_liability_response: IAccount | null = null;
  let accounts_get_response: IAccount | null = null;
  let accounts_list_response: IAccount[] | null = null;
  let balances_create_response: IAccountBalance | null = null;
  let test_credit_card_account: IAccount | null = null;
  let test_auto_loan_account: IAccount | null = null;
  let card_create_response: IAccountCard | null = null;
  let payoff_create_response: IAccountPayoff | null = null;
  let verification_session_create: IAccountVerificationSession | null = null;
  let verification_session_update: IAccountVerificationSession | null = null;
  let sensitive_data_response: IAccountSensitive | null = null;

  before(async () => {
    holder_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Test',
        last_name: 'McTesterson',
        phone: '+15121231111'
      }
    });
    holder_connect_response = await client.entities(holder_1_response?.id || '').connect.create();
    test_credit_card_account = (await client.accounts.list({
      holder_id: holder_1_response?.id || '',
      "liability.type": 'credit_card',
      "liability.mch_id": "mch_302086",
    }))[0];
    test_auto_loan_account = (await client.accounts.list({
      holder_id: holder_1_response?.id || '',
      "liability.type": 'auto_loan',
      "liability.mch_id": "mch_2347",
    }))[0];
  });

  describe('accounts.create', () => {
    it('should successfully create an `ach` account.', async () => {
      accounts_create_ach_response = await client.accounts.create({
        holder_id: holder_1_response?.id || '',
        ach: {
          routing: '062103000',
          number: '123456789',
          type: 'checking',
        },
      });

      const expect_results = {
        id: accounts_create_ach_response?.id,
        holder_id: holder_1_response?.id,
        type: 'ach',
        ach: { routing: '062103000', number: '123456789', type: 'checking' },
        latest_verification_session: accounts_create_ach_response?.latest_verification_session,
        products: [ 'payment' ],
        restricted_products: [],
        status: 'active',
        error: null,
        metadata: null,
        created_at: accounts_create_ach_response?.created_at,
        updated_at: accounts_create_ach_response?.updated_at
      };

      accounts_create_ach_response.should.be.eql(expect_results);
    });

    it('should successfully create a `liability` account.', async () => {
      accounts_create_liability_response = await client.accounts.create({
        holder_id: holder_1_response?.id || '',
        liability: {
          mch_id: 'mch_302086',
          account_number: '4936494462408721',
        },
      });

      const expect_results = {
        id: accounts_create_liability_response?.id,
        holder_id: holder_1_response?.id,
        type: 'liability',
        liability: {
          mch_id: 'mch_183',
          mask: '8721',
          ownership: 'unknown',
          type: 'credit_card',
          name: 'Chase Sapphire Reserve'
        },
        latest_verification_session: null,
        balance: null,
        update: null,
        card: null,
        products: [ 'account_sensitive', 'balance', 'payment' ],
        restricted_products: [],
        subscriptions: [],
        available_subscriptions: [],
        restricted_subscriptions: [ 'update', 'update.snapshot' ],
        status: 'active',
        error: null,
        metadata: null,
        created_at: accounts_create_liability_response?.created_at,
        updated_at: accounts_create_liability_response?.updated_at
      };

      const accounts_create_liability_response_sorted = {
        ...accounts_create_liability_response,
        products: accounts_create_liability_response?.products?.sort(),
      };

      accounts_create_liability_response_sorted.should.be.eql(expect_results);
    });
  });

  describe('accounts.get', () => {
    it('should successfully get an account.', async () => {
      accounts_get_response = await client.accounts.retrieve(accounts_create_ach_response?.id || '12345');

      const expect_results = {
        id: accounts_create_ach_response?.id,
        holder_id: holder_1_response?.id,
        type: 'ach',
        ach: { routing: '062103000', number: '123456789', type: 'checking' },
        latest_verification_session: accounts_create_ach_response?.latest_verification_session,
        products: [ 'payment' ],
        restricted_products: [],
        status: 'active',
        error: null,
        metadata: null,
        created_at: accounts_create_ach_response?.created_at,
        updated_at: accounts_get_response?.updated_at
      }
      accounts_get_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.list', () => {
    it('should successfully list accounts.', async () => {
      accounts_list_response = await client.accounts.list({
        holder_id: holder_1_response?.id || '12345',
        type: 'liability',
        status: 'active',
      });
      const account_ids = accounts_list_response
        .map(account => account.id)
        .filter(acc_id => acc_id !== accounts_create_liability_response?.id)
        .sort((a, b) => a < b ? 1 : -1)
        .slice(0, holder_connect_response?.accounts?.length);
      
      const connect_acc_ids = holder_connect_response?.accounts?.sort((a, b) => a < b ? 1 : -1) || ['no_data'];
      const dupes = [...account_ids, ...connect_acc_ids]
      const test_length = Array.from(new Set(dupes)).length;

      accounts_list_response.should.be.not.null;
      Array.isArray(accounts_list_response).should.be.true;
      test_length.should.be.eql(connect_acc_ids.length);
    });
  });
  
  describe('accounts.balances', () => {
    it('should successfully create a request to get the balance of an account.', async () => {
      balances_create_response = await client
        .accounts(test_credit_card_account?.id || '')
        .balances
        .create();

      const expect_results = {
        id: balances_create_response.id,
        account_id: test_credit_card_account?.id,
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
        .accounts(test_credit_card_account?.id || '')
        .balances
        .retrieve(balances_create_response?.id || '');
      }

      let account_balances;
      let retries = 5;
      while (retries > 0) {
        try {
          account_balances = await getAccountBalances();
          if (account_balances.status === 'completed' || account_balances.status === 'failed') {
            break;
          }
          await sleep(5000);
        } catch (error) {
          console.error('Error occurred while retrieving account balances:', error);
          throw error; // Rethrow the error to fail the test
        }
        retries--;
      }

      const expect_results = {
        id: balances_create_response?.id,
        account_id: test_credit_card_account?.id,
        status: 'completed',
        amount: 1866688,
        error: null,
        created_at: balances_create_response?.created_at,
        updated_at: account_balances?.updated_at
      };

      account_balances.should.be.eql(expect_results);
    });  
  });

  describe('accounts.cards', () => {
    it('should successfully create a card for an account.', async () => {
      card_create_response = await client
        .accounts(test_credit_card_account?.id || '')
        .cards
        .create();

        const expect_results = {
          id: card_create_response?.id,
          account_id: test_credit_card_account?.id,
          network: 'visa',
          status: 'completed',
          issuer: null,
          last4: '1580',
          brands: [
            {
              art_id: 'art_FJ84yL4Q4er8g',
              url: 'https://static.methodfi.com/cards/art_FJ84yL4Q4er8g.png',
              name: 'Chase Freedom Unlimited'
            },
            {
              art_id: 'art_9TzzmXDWGNrzf',
              url: 'https://static.methodfi.com/cards/art_9TzzmXDWGNrzf.png',
              name: 'Chase Freedom Visa Signature'
            }
          ],
          shared: true,
          error: null,
          created_at: card_create_response.created_at,
          updated_at: card_create_response.updated_at
        };

      card_create_response.should.be.eql(expect_results);
    });

    it('should successfully retrieve a card for an account.', async () => {
      const card_retrieve_response = await client
        .accounts(test_credit_card_account?.id || '')
        .cards
        .retrieve(card_create_response?.id || '');

      const expect_results = {
        id: card_create_response?.id,
        account_id: test_credit_card_account?.id,
        network: 'visa',
        status: 'completed',
        issuer: null,
        last4: '1580',
        brands: [
          {
            art_id: 'art_FJ84yL4Q4er8g',
            url: 'https://static.methodfi.com/cards/art_FJ84yL4Q4er8g.png',
            name: 'Chase Freedom Unlimited'
          },
          {
            art_id: 'art_9TzzmXDWGNrzf',
            url: 'https://static.methodfi.com/cards/art_9TzzmXDWGNrzf.png',
            name: 'Chase Freedom Visa Signature'
          }
        ],
        shared: true,
        error: null,
        created_at: card_retrieve_response?.created_at,
        updated_at: card_retrieve_response?.updated_at
      };

      card_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('accounts.payoffs', () => {
    it('should successfully create a payoff request for an account.', async () => {
      payoff_create_response = await client
        .accounts(test_auto_loan_account?.id || '')
        .payoffs
        .create();

      const expect_results = {
        id: payoff_create_response.id,
        account_id: test_auto_loan_account?.id,
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
        return  await client
          .accounts(test_auto_loan_account?.id || '12345')
          .payoffs
          .retrieve(payoff_create_response?.id || '12345');
      };

      let payoff_quote;
      let retries = 5;
      while (retries > 0) {
        try {
          payoff_quote = await getPayoffQuotes();
          if (payoff_quote.status === 'completed' || payoff_quote.status === 'failed') {
            break;
          }
          await sleep(5000);
        } catch (error) {
          console.error('Error occurred while retrieving account balances:', error);
          throw error; // Rethrow the error to fail the test
        }
        retries--;
      }

      const expect_results = {
        id: payoff_create_response?.id,
        account_id: test_auto_loan_account?.id,
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
  });

  describe('accounts.verificationSessions', () => {
    it('should successfully create a verification session for an account.', async () => {
      verification_session_create = await client
        .accounts(test_credit_card_account?.id || '')
        .verificationSessions
        .create({
          type: 'instant'
        });

        const expect_results = {
          id: verification_session_create.id,
          account_id: test_credit_card_account?.id,
          status: 'pending',
          type: 'instant',
          error: null,
          instant: {
            exp_check: null,
            exp_month: null,
            exp_year: null,
            number: "xxxxxxxxxxxxxxxx"
          },
          created_at: verification_session_create.created_at,
          updated_at: verification_session_create.updated_at
        };
  
        verification_session_create.should.be.eql(expect_results);
    });

    it('should successfully update a verification session for an account.', async () => {

      verification_session_update = await client
        .accounts(test_credit_card_account?.id || '12345')
        .verificationSessions
        .update(verification_session_create?.id || '12345', {
          instant: {
            exp_month: '09',
            exp_year: '2028',
          }  
        });

      const expect_results = {
        id: verification_session_update.id,
        account_id: test_credit_card_account?.id,
        status: 'verified',
        type: 'instant',
        error: null,
        instant: {
          exp_check: "pass",
          exp_month: "xx",
          exp_year: "xxxx",
          number: "xxxxxxxxxxxxxxxx"
        },
        created_at: verification_session_update.created_at,
        updated_at: verification_session_update.updated_at
      };

      verification_session_update.should.be.eql(expect_results);
    });

    it('should successfully retrieve a verification session for an account.', async () => {
      const getVerificationSession = async () => {
        return await client
          .accounts(test_credit_card_account?.id || '')
          .verificationSessions
          .retrieve(verification_session_update?.id || '');
      };

      let verification_session;
      let retries = 5;
      while (retries > 0) {
        try {
          verification_session = await getVerificationSession();
          if (verification_session.status === 'verified' || verification_session.status === 'failed') {
            break;
          }
          await sleep(5000);
        } catch (error) {
          console.error('Error occurred while retrieving account balances:', error);
          throw error; // Rethrow the error to fail the test
        }
        retries--;
      }

      const expect_results = {
        id: verification_session_update?.id,
        account_id: test_credit_card_account?.id,
        status: 'verified',
        type: 'instant',
        error: null,
        instant: {
          exp_check: "pass",
          exp_month: "xx",
          exp_year: "xxxx",
          number: "xxxxxxxxxxxxxxxx"
        },
        created_at: verification_session?.created_at,
        updated_at: verification_session?.updated_at
      };

      verification_session.should.be.eql(expect_results);
    });
  });

  describe('accounts.sensitive', () => {
    it('should successfully create a request to get sensitive data for an account.', async () => {
      sensitive_data_response = await client
        .accounts(test_credit_card_account?.id || '')
        .sensitive
        .create({ expand: [
          'credit_card.number',
          'credit_card.exp_month',
          'credit_card.exp_year'
        ] 
      });

        const expect_results = {
          id: sensitive_data_response.id,
          account_id: test_credit_card_account?.id,
          type: 'credit_card',
          credit_card: {
            billing_zip_code: null,
            number: '5555555555551580',
            exp_month: '09',
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
});
