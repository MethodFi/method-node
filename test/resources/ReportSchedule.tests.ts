import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IReportSchedule } from '../../src/resources/ReportSchedule';
import { IResponse } from '../../src/configuration';

should();

describe('Report Schedules - core methods tests', () => {
  let report_schedule_create_response: IResponse<IReportSchedule>;
  let report_schedule_list_response: IResponse<IReportSchedule>[];
  let report_schedule_retrieve_response: IResponse<IReportSchedule>;
  let report_schedule_update_response: IResponse<IReportSchedule>;

  describe('reportSchedules.create', () => {
    it('should successfully create a report schedule.', async () => {
      report_schedule_create_response = await client.reportSchedules.create({
        types: ['ach.pull.nightly'],
        delivery_methods: ['webhook', 'email'],
        recipients: ['example@methodfi.com'],
        cron: '0 8 * * *',
      });

      const expect_results: IReportSchedule = {
        id: report_schedule_create_response.id,
        types: ['ach.pull.nightly'],
        delivery_methods: ['webhook', 'email'],
        recipients: ['example@methodfi.com'],
        cron: '0 8 * * *',
        status: 'active',
        created_at: report_schedule_create_response.created_at,
        updated_at: report_schedule_create_response.updated_at,
      };

      report_schedule_create_response.should.be.eql(expect_results);
    });
  });

  describe('reportSchedules.list', () => {
    it('should successfully list report schedules.', async () => {
      report_schedule_list_response = await client.reportSchedules.list();

      (Array.isArray(report_schedule_list_response)).should.be.true;
    });
  });

  describe('reportSchedules.retrieve', () => {
    it('should successfully retrieve a report schedule.', async () => {
      report_schedule_retrieve_response = await client.reportSchedules.retrieve(
        report_schedule_create_response.id,
      );

      const expect_results: IReportSchedule = {
        id: report_schedule_create_response.id,
        types: ['ach.pull.nightly'],
        delivery_methods: ['webhook', 'email'],
        recipients: ['example@methodfi.com'],
        cron: '0 8 * * *',
        status: 'active',
        created_at: report_schedule_retrieve_response.created_at,
        updated_at: report_schedule_retrieve_response.updated_at,
      };

      report_schedule_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('reportSchedules.types', () => {
    it('should successfully add a type.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .types
        .add({ type: 'payments.created.previous' });

      response.types.should.include('payments.created.previous');
    });

    it('should successfully replace the types.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .types
        .replace({ types: ['ach.pull.nightly', 'payments.failed.previous_day'] });

      response.types.should.be.eql(['ach.pull.nightly', 'payments.failed.previous_day']);
    });

    it('should successfully remove a type.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .types
        .delete('payments.failed.previous_day');

      response.types.should.not.include('payments.failed.previous_day');
    });
  });

  describe('reportSchedules.deliveryMethods', () => {
    it('should successfully add a delivery method.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .deliveryMethods
        .add({ delivery_method: 'email' });

      response.delivery_methods.should.include('email');
    });

    it('should successfully replace the delivery methods.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .deliveryMethods
        .replace({ delivery_methods: ['webhook'] });

      response.delivery_methods.should.be.eql(['webhook']);
    });

    it('should successfully remove a delivery method.', async () => {
      await client
        .reportSchedules(report_schedule_create_response.id)
        .deliveryMethods
        .add({ delivery_method: 'email' });

      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .deliveryMethods
        .delete('email');

      response.delivery_methods.should.not.include('email');
    });
  });

  describe('reportSchedules.recipients', () => {
    it('should successfully add a recipient.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .recipients
        .add({ recipient: 'reports@methodfi.com' });

      (response.recipients || []).should.include('reports@methodfi.com');
    });

    it('should successfully replace the recipients.', async () => {
      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .recipients
        .replace({ recipients: ['ops@methodfi.com'] });

      (response.recipients || []).should.be.eql(['ops@methodfi.com']);
    });

    it('should successfully remove a recipient.', async () => {
      await client
        .reportSchedules(report_schedule_create_response.id)
        .recipients
        .add({ recipient: 'temp@methodfi.com' });

      const response = await client
        .reportSchedules(report_schedule_create_response.id)
        .recipients
        .delete('temp@methodfi.com');

      (response.recipients || []).should.not.include('temp@methodfi.com');
    });
  });

  describe('reportSchedules.update', () => {
    it('should successfully update a report schedule cron.', async () => {
      report_schedule_update_response = await client.reportSchedules.update(
        report_schedule_create_response.id,
        { cron: '0 9 * * 1-5' },
      );

      report_schedule_update_response.cron.should.be.eql('0 9 * * 1-5');
    });
  });

  describe('reportSchedules.delete', () => {
    it('should successfully delete a report schedule.', async () => {
      const report_schedule_delete_response = await client.reportSchedules.delete(
        report_schedule_create_response.id,
      );

      (report_schedule_delete_response === null).should.be.true;
    });
  });
});
