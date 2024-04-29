import { should } from 'chai';
import { describe } from 'mocha';
import { IEntity } from '../../src/resources/Entity/types';
import { IAccount } from '../../src/resources/Account/types';
import { client } from '../config';

should();

describe('Accounts - core methods tests', () => {
  let holder_1_response: IEntity | null = null;

  let accounts_create_ach_response: IAccount | null = null;
  let accounts_create_liability_response: IAccount | null = null;
  let accounts_get_response: IAccount | null = null;
  let accounts_list_response: IAccount[] | null = null;

  before(async () => {
    holder_1_response = await client.entities.create({ type: 'individual', individual: {} });
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

      (accounts_create_ach_response !== null).should.be.true;
    });

    it('should successfully create a `liability` account.', async () => {
      accounts_create_liability_response = await client.accounts.create({
        holder_id: holder_1_response?.id || '',
        liability: {
          mch_id: 'mch_3',
          account_number: '123456789',
        },
      });

      (accounts_create_liability_response !== null).should.be.true;
    });
  });

  describe('accounts.get', () => {
    it('should successfully get an account.', async () => {
      accounts_get_response = await client.accounts.retrieve(accounts_create_ach_response?.id || '');

      (accounts_get_response !== null).should.be.true;
    });
  });

  describe('accounts.list', () => {
    it('should successfully list accounts.', async () => {
      accounts_list_response = await client.accounts.list({ holder_id: holder_1_response?.id || '' });

      (accounts_list_response !== null).should.be.true;
      Array.isArray(accounts_list_response).should.be.true;
    });
  });

  describe('accounts.balances.retrieve', () => {
    it('should successfully retrieve the balance of an account.', async () => {
      const account_balances = await client
        .accounts(accounts_create_liability_response?.id || '')
        .balances
        .retrieve(accounts_create_ach_response?.id || '');

      (account_balances !== null).should.be.true;
    });
  });
});
