import Configuration, { IConfigurationOpts } from './configuration';
import Account from './resources/Account';
import Bin from './resources/Bin';
import Element from './resources/Element';
import Entity from './resources/Entity';
import Merchant from './resources/Merchant';
import Payment from './resources/Payment';
import Report from './resources/Report';
import RoutingNumber from './resources/RoutingNumber';
import Webhook from './resources/Webhook';
import HealthCheck, { IPingResponse } from './resources/HealthCheck';
import Connection from './resources/Connection';
import Simulate from './resources/Simulate';
import Transaction from './resources/Transaction';

export class Method {
  accounts: Account;
  bins: Bin;
  elements: Element;
  entities: Entity;
  merchants: Merchant;
  payments: Payment;
  reports: Report;
  routingNumbers: RoutingNumber;
  webhooks: Webhook;
  healthcheck: HealthCheck;
  connections: Connection;
  simulate: Simulate;
  transactions: Transaction;

  constructor(opts: IConfigurationOpts) {
    const config = new Configuration(opts);

    // Resources
    this.accounts = new Account(config);
    this.bins = new Bin(config);
    this.elements = new Element(config);
    this.entities = new Entity(config);
    this.merchants = new Merchant(config);
    this.payments = new Payment(config);
    this.reports = new Report(config);
    this.routingNumbers = new RoutingNumber(config);
    this.webhooks = new Webhook(config);
    this.healthcheck = new HealthCheck(config);
    this.connections = new Connection(config);
    this.simulate = new Simulate(config);
    this.transactions = new Transaction(config);
  }

  public async ping(): Promise<IPingResponse> {
    return this.healthcheck.get();
  }
}
