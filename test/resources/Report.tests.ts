import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import { IReport } from '../../src/resources/Report';

should();

describe('Reports - core methods tests', () => {
  let reports_create_response: IReport | null = null;
  let reports_get_response: IReport | null = null;
  let reports_download_response: string | null = null;

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
      reports_get_response = await client.reports.retrieve(reports_create_response?.id || '');

      (reports_get_response !== null).should.be.true;
    });
  });

  describe('reports.download', () => {
    it('should successfully download a report.', async () => {
      reports_download_response = await client.reports.download(reports_get_response?.id || '');

      (reports_download_response !== null).should.be.true;
    });
  });
});
