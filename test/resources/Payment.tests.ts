import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IEntity } from '../../src/resources/Entity/types';
import { IAccount } from '../../src/resources/Account/types';
import { IPayment } from '../../src/resources/Payment';

should();

describe('Payments - core methods tests', () => {
  let holder_1_response: IEntity | null = null;
  let source_1_response: IAccount | null = null;
  let destination_1_response: IAccount | null = null;

  let payments_create_response: IPayment | null = null;
  let payments_get_response: IPayment | null = null;
  let payments_list_response: IPayment[] | null = null;
  let payments_delete_response: IPayment | null = null;

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
    await client.entities(holder_1_response?.id || '').verificationSessions.create({
      type: 'phone',
      method: 'byo_sms',
      byo_sms: {
        timestamp: '2021-09-01T00:00:00.000Z',
      },
    });
    await client.entities(holder_1_response?.id || '').verificationSessions.create({
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
        source: source_1_response?.id || '',
        destination: destination_1_response?.id || '',
        description: 'MethodNode',
      });

      (payments_create_response !== null).should.be.true;
    });
  });

  describe('payments.get', () => {
    it('should successfully get a payment.', async () => {
      payments_get_response = await client.payments.retrieve(payments_create_response?.id || '');

      (payments_get_response !== null).should.be.true;
    });
  });

  describe('payments.list', () => {
    it('should successfully list payments.', async () => {
      payments_list_response = await client.payments.list();

      (payments_list_response !== null).should.be.true;
      Array.isArray(payments_list_response).should.be.true;
    });
  });

  describe('payments.delete', () => {
    it('should successfully delete a payment.', async () => {
      payments_delete_response = await client.payments.delete(payments_create_response?.id || '');

      (payments_delete_response !== null).should.be.true;
    });
  });
});
