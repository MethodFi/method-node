import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IManagedAccount, IManagedAccountTransaction } from '../../src/resources/ManagedAccount';
import { IResponse } from '../../src/configuration';

should();

describe('ManagedAccounts - core methods tests', () => {
  let managed_account_list_response: IResponse<IManagedAccount>[];
  let managed_account_retrieve_response: IResponse<IManagedAccount>;

  describe('managedAccounts.list', () => {
    it('should successfully list managed accounts.', async () => {
      managed_account_list_response = await client.managedAccounts.list();

      (Array.isArray(managed_account_list_response)).should.be.true;
    });
  });

  describe('managedAccounts.retrieve', () => {
    it('should successfully retrieve a managed account.', async () => {
      if (managed_account_list_response.length === 0) {
        return;
      }

      managed_account_retrieve_response = await client.managedAccounts.retrieve(
        managed_account_list_response[0].id,
      );

      const expect_results: IManagedAccount = {
        id: managed_account_retrieve_response.id,
        type: managed_account_retrieve_response.type,
        status: managed_account_retrieve_response.status,
        routing_number: managed_account_retrieve_response.routing_number,
        account_number: managed_account_retrieve_response.account_number,
        balance: managed_account_retrieve_response.balance,
        created_at: managed_account_retrieve_response.created_at,
        updated_at: managed_account_retrieve_response.updated_at,
      };

      managed_account_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('managedAccounts.transactions', () => {
    it('should successfully list transactions for a managed account.', async () => {
      if (managed_account_list_response.length === 0) {
        return;
      }

      const transactions = await client
        .managedAccounts(managed_account_list_response[0].id)
        .transactions
        .list();

      (Array.isArray(transactions)).should.be.true;
    });
  });
});
