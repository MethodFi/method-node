/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient } from '../../src';
import { Environments } from '../../src/client/enums';
import type { TAccountResponse } from '../../src/lib/accounts/types';
import type { TEntityResponse } from '../../src/lib/entities/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Accounts - core methods tests', () => {
  let holder_1_response: ?TEntityResponse = null;

  let accounts_create_ach_response: ?TAccountResponse = null;
  let accounts_create_liability_response: ?TAccountResponse = null;
  let accounts_get_response: ?TAccountResponse = null;
  let accounts_list_response: ?Array<TAccountResponse> = null;

  before(async () => {
    holder_1_response = await client.entities.create({ type: 'individual', individual: {} });
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

      (accounts_create_ach_response !== null).should.be.true;
    });

    it('should successfully create a `liability` account.', async () => {
      accounts_create_liability_response = await client.accounts.create({
        holder_id: holder_1_response.id,
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
      accounts_get_response = await client.accounts.get(accounts_create_ach_response.id);

      (accounts_get_response !== null).should.be.true;
    });
  });

  describe('accounts.list', () => {
    it('should successfully list accounts.', async () => {
      accounts_list_response = await client.accounts.list({ holder_id: holder_1_response.id });

      (accounts_list_response !== null).should.be.true;
      Array.isArray(accounts_list_response).should.be.true;
    });
  });
});
