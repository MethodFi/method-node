/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient } from '../../src';
import { Environments } from '../../src/client/enums';
import type { TReportResponse } from '../../src/lib/reports/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Reports - core methods tests', () => {
  let reports_create_response: ?TReportResponse = null;
  let reports_get_response: ?TReportResponse = null;
  let reports_download_response: ?string = null;

  describe('reports.create', () => {
    it('should successfully create a report.', async () => {
      reports_create_response = await client.reports.create({
        type: 'payments.created.current',
      });

      (reports_create_response !== null).should.be.true;
    });
  });

  describe('reports.get', () => {
    it('should successfully get a report.', async () => {
      reports_get_response = await client.reports.get(reports_create_response.id);

      (reports_get_response !== null).should.be.true;
    });
  });

  describe('reports.download', () => {
    it('should successfully download a report.', async () => {
      reports_download_response = await client.reports.download(reports_get_response.id);

      (reports_download_response !== null).should.be.true;
    });
  });
});
