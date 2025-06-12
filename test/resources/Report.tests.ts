import { should } from 'chai';
import { describe } from 'mocha';
import { client } from '../config';
import type { IReport } from '../../src/resources/Report';
import { IResponse } from '../../src/configuration';

should();

//TODO: Add tests for each report type
describe('Reports - core methods tests', () => {
  let reports_create_response: IResponse<IReport>;
  let reports_retrieve_response: IResponse<IReport>;
  let reports_download_response: string;

  describe('reports.create', () => {
    it('should successfully create a report.', async () => {
      reports_create_response = await client.reports.create({
        type: 'payments.created.current',
      });

      const expect_results: IReport = {
        id: reports_create_response.id,
        type: 'payments.created.current',
        url: `https://dev.methodfi.com/reports/${reports_create_response.id}/download`,
        status: 'completed',
        metadata: reports_create_response.metadata,
        created_at: reports_create_response.created_at,
        updated_at: reports_create_response.updated_at,
      };

      reports_create_response.should.be.eql(expect_results);
    });
  });

  describe('reports.retrieve', () => {
    it('should successfully retrieve a report.', async () => {
      reports_retrieve_response = await client.reports.retrieve(reports_create_response.id);
      
      const expect_results: IReport = {
        id: reports_create_response.id,
        type: 'payments.created.current',
        url: `https://dev.methodfi.com/reports/${reports_create_response.id}/download`,
        status: 'completed',
        metadata: reports_create_response.metadata,
        created_at: reports_retrieve_response.created_at,
        updated_at: reports_retrieve_response.updated_at,
      };
      
      reports_retrieve_response.should.be.eql(expect_results);
    });
  });

  describe('reports.download', () => {
    it('should successfully download a report.', async () => {
      reports_download_response = await client.reports.download(reports_retrieve_response.id);

      (reports_download_response !== null).should.be.true;
    });
  });
});
