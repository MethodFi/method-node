import { should } from 'chai';
import {
  after, before, beforeEach, describe, it,
} from 'mocha';
import * as http from 'http';
import type { AddressInfo } from 'net';
import { Method } from '../../src/method';
import type { IRequestConfig } from '../../src/resource';

should();

interface ICapturedRequest {
  url: string;
  headers: http.IncomingHttpHeaders;
};

interface ICreateUnderTest {
  name: string;
  create: (requestConfig?: IRequestConfig) => Promise<any>;
};

const idempotency_key = 'test-idempotency-key';

describe('Request config - core methods tests', () => {
  let server: http.Server;
  let client: Method;
  let requests: ICapturedRequest[] = [];

  before((done) => {
    server = http.createServer((req, res) => {
      requests.push({ url: req.url || '', headers: req.headers });
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ data: {} }));
    });

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;

      client = new Method({
        apiKey: 'sk_test',
        env: 'dev',
        baseURL: `http://127.0.0.1:${port}`,
      });

      done();
    });
  });

  after((done) => {
    server.close(() => done());
  });

  beforeEach(() => {
    requests = [];
  });

  const creates: ICreateUnderTest[] = [
    {
      name: 'accounts.create',
      create: (requestConfig?: IRequestConfig) => client.accounts.create({
        holder_id: 'ent_au22adjEjWQpF',
        ach: { routing: '367537407', number: '57838927', type: 'checking' },
      }, requestConfig),
    },
    {
      name: 'entities.create',
      create: (requestConfig?: IRequestConfig) => client.entities.create({
        type: 'individual',
        individual: { first_name: 'Kevin', last_name: 'Doyle' },
      }, requestConfig),
    },
    {
      name: 'entities.subscriptions.create',
      create: (requestConfig?: IRequestConfig) => client
        .entities('ent_au22adjEjWQpF')
        .subscriptions
        .create({ enroll: 'credit_score' }, requestConfig),
    },
    {
      name: 'entities.manualConnect.create',
      create: (requestConfig?: IRequestConfig) => client
        .entities('ent_au22adjEjWQpF')
        .manualConnect
        .create({ bureau: 'equifax', tradelines: [] }, requestConfig),
    },
    {
      name: 'payments.create',
      create: (requestConfig?: IRequestConfig) => client.payments.create({
        amount: 5000,
        source: 'acc_JMJZTrpu3vAmA',
        destination: 'acc_AXthEBs9NPbfa',
        description: 'Loan Pmt',
      }, requestConfig),
    },
    {
      name: 'reports.create',
      create: (requestConfig?: IRequestConfig) => client.reports.create({
        type: 'payments.created.current',
      }, requestConfig),
    },
    {
      name: 'secrets.create',
      create: (requestConfig?: IRequestConfig) => client.secrets.create({
        value: 'test-secret-value',
      }, requestConfig),
    },
    {
      name: 'forwardingRequests.create',
      create: (requestConfig?: IRequestConfig) => client.forwardingRequests.create({
        url: 'https://api.example.app/forward',
        method: 'POST',
        headers: {},
        body: '{}',
        bindings: {},
      }, requestConfig),
    },
    {
      name: 'webhooks.create',
      create: (requestConfig?: IRequestConfig) => client.webhooks.create({
        type: 'payment.create',
        url: 'https://api.example.app/webhook',
      }, requestConfig),
    },
    {
      name: 'teams.create',
      create: (requestConfig?: IRequestConfig) => client.teams.create({
        name: 'Test Team',
      }, requestConfig),
    },
    {
      name: 'teams.publicKeys.create',
      create: (requestConfig?: IRequestConfig) => client.teams.publicKeys.create({
        jwk: { kty: 'RSA' },
      }, requestConfig),
    },
  ];

  creates.forEach((resource) => {
    describe(resource.name, () => {
      it('should send the idempotency key as an Idempotency-Key header.', async () => {
        await resource.create({ idempotency_key });

        requests.should.have.length(1);
        requests[0].headers.should.have.property('idempotency-key', idempotency_key);
      });

      it('should not send the idempotency key as a query parameter.', async () => {
        await resource.create({ idempotency_key });

        requests.should.have.length(1);
        requests[0].url.should.not.contain('idempotency_key');
      });

      it('should not send an Idempotency-Key header when no request config is given.', async () => {
        await resource.create();

        requests.should.have.length(1);
        requests[0].headers.should.not.have.property('idempotency-key');
      });
    });
  });

  describe('entities.connect.create', () => {
    it('should send the Idempotency-Key header alongside its query parameters.', async () => {
      await client
        .entities('ent_au22adjEjWQpF')
        .connect
        .create({}, { expand: ['accounts'] }, { idempotency_key });

      requests.should.have.length(1);
      requests[0].headers.should.have.property('idempotency-key', idempotency_key);
      requests[0].url.should.contain('expand');
    });
  });
});
