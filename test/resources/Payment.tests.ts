import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IEntity } from '../../src/resources/Entity';
import { IAccount } from '../../src/resources/Account';
import { IPayment } from '../../src/resources/Payment';

should();

describe('Payments - core methods tests', () => {
  let holder_1_response: IEntity;
  let source_1_response: IAccount;
  let destination_1_response: IAccount;

  let payments_create_response: IPayment;
  let payments_retrieve_response: IPayment;
  let payments_list_response: IPayment[];
  let payments_delete_response: IPayment;

  before(async () => {
    holder_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        dob: '1930-03-11',
        email: 'kevin.doyle@gmail.com',
        phone: '+15121231111',
      },
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
    source_1_response = await client.accounts.create({
      holder_id: holder_1_response.id,
      ach: {
        routing: '062103000',
        number: '123456789',
        type: 'checking',
      },
    });
    destination_1_response = await client.accounts.create({
      holder_id: holder_1_response.id,
      liability: {
        mch_id: 'mch_3',
        account_number: '123456789',
      },
    });
  });

  describe('payments.create', () => {
    it('should successfully create a payment.', async () => {
      payments_create_response = await client.payments.create({
        amount: 5000,
        source: source_1_response.id,
        destination: destination_1_response.id,
        description: 'MethodNode',
      });

      const expect_results: IPayment = {
        id: payments_create_response.id,
        source: source_1_response.id,
        destination: destination_1_response.id,
        amount: 5000,
        description: 'MethodNode',
        status: 'pending',
        estimated_completion_date: payments_create_response.estimated_completion_date,
        source_trace_id: null,
        source_settlement_date: payments_create_response.source_settlement_date,
        source_status: 'pending',
        destination_trace_id: null,
        destination_settlement_date: payments_create_response.destination_settlement_date,
        destination_status: 'pending',
        reversal_id: null,
        fee: null,
        type: 'standard',
        error: null,
        metadata: null,
        created_at: payments_create_response.created_at,
        updated_at: payments_create_response.updated_at,
      };

      payments_create_response.should.be.eql(expect_results);
    });
  });

  describe('payments.retrieve', () => {
    it('should successfully retrieve a payment by id.', async () => {
      payments_retrieve_response = await client.payments.retrieve(payments_create_response.id);
      
      const expect_results: IPayment = {
        id: payments_create_response.id,
        source: source_1_response.id,
        destination: destination_1_response.id,
        amount: 5000,
        description: 'MethodNode',
        status: 'pending',
        estimated_completion_date: payments_create_response.estimated_completion_date,
        source_trace_id: null,
        source_settlement_date: payments_create_response.source_settlement_date,
        source_status: 'pending',
        destination_trace_id: null,
        destination_settlement_date: payments_create_response.destination_settlement_date,
        destination_status: 'pending',
        reversal_id: null,
        fee: null,
        type: 'standard',
        error: null,
        metadata: null,
        created_at: payments_retrieve_response.created_at,
        updated_at: payments_retrieve_response.updated_at,
        fund_status: 'pending'
      };

      payments_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('payments.list', () => {
    it('should successfully list payments.', async () => {
      payments_list_response = await client.payments.list();
      const payment_ids = payments_list_response.map((payment) => payment.id);
      payment_ids.should.contain(payments_create_response.id);
    });
  });

  describe('payments.delete', () => {
    it('should successfully delete a payment.', async () => {
      payments_delete_response = await client.payments.delete(payments_create_response.id);
      
      const expect_results: IPayment = {
        id: payments_create_response.id,
        source: source_1_response.id,
        destination: destination_1_response.id,
        amount: 5000,
        description: 'MethodNode',
        status: 'canceled',
        estimated_completion_date: payments_create_response.estimated_completion_date,
        source_trace_id: null,
        source_settlement_date: payments_create_response.source_settlement_date,
        source_status: 'canceled',
        destination_trace_id: null,
        destination_settlement_date: payments_create_response.destination_settlement_date,
        destination_status: 'canceled',
        reversal_id: null,
        fee: null,
        type: 'standard',
        error: null,
        metadata: null,
        created_at: payments_delete_response.created_at,
        updated_at: payments_delete_response.updated_at,
      };

      payments_delete_response.should.be.eql(expect_results);
    });
  });
});
