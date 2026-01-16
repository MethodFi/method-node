import { should } from 'chai';
import { describe, it } from 'mocha';
import { MethodClient, Environments } from '../../src';
import Configuration from '../../src/configuration';

should();

describe('Configuration - baseUrl tests', () => {
  describe('Configuration constructor', () => {
    it('should use default URL when env is provided without baseUrl', () => {
      const config = new Configuration({
        apiKey: 'test_api_key',
        env: Environments.dev,
      });
      config.baseURL.should.equal('https://dev.methodfi.com');
    });

    it('should use default URL for production env', () => {
      const config = new Configuration({
        apiKey: 'test_api_key',
        env: Environments.production,
      });
      config.baseURL.should.equal('https://production.methodfi.com');
    });

    it('should use default URL for sandbox env', () => {
      const config = new Configuration({
        apiKey: 'test_api_key',
        env: Environments.sandbox,
      });
      config.baseURL.should.equal('https://sandbox.methodfi.com');
    });

    it('should use custom baseUrl when provided', () => {
      const config = new Configuration({
        apiKey: 'test_api_key',
        baseUrl: 'http://localhost:3000',
      });
      config.baseURL.should.equal('http://localhost:3000');
    });

    it('should use custom baseUrl over env when both are provided', () => {
      const config = new Configuration({
        apiKey: 'test_api_key',
        env: Environments.production,
        baseUrl: 'http://localhost:8080',
      });
      config.baseURL.should.equal('http://localhost:8080');
    });

    it('should throw error when neither env nor baseUrl is provided', () => {
      (() => {
        new Configuration({
          apiKey: 'test_api_key',
        } as any);
      }).should.throw('Invalid env');
    });

    it('should throw error when apiKey is not provided', () => {
      (() => {
        new Configuration({
          env: Environments.dev,
        } as any);
      }).should.throw('Invalid apiKey');
    });
  });

  describe('MethodClient with custom baseUrl', () => {
    it('should create client with custom baseUrl', () => {
      const client = new MethodClient({
        apiKey: 'test_api_key',
        baseUrl: 'http://localhost:3000',
      });
      client.should.not.be.null;
    });

    it('should create client with env', () => {
      const client = new MethodClient({
        apiKey: 'test_api_key',
        env: Environments.sandbox,
      });
      client.should.not.be.null;
    });
  });
});
