import Configuration, { IConfigurationOpts, IResponse } from './configuration';
import Account from './resources/Account';
import Element from './resources/Element';
import Entity from './resources/Entity';
import Merchant from './resources/Merchant';
import Payment from './resources/Payment';
import Report from './resources/Report';
import Webhook from './resources/Webhook';
import HealthCheck, { IPingResponse } from './resources/HealthCheck';
import Simulate from './resources/Simulate';

export class Method {
  accounts: Account;
  elements: Element;
  entities: Entity;
  merchants: Merchant;
  payments: Payment;
  reports: Report;
  webhooks: Webhook;
  healthcheck: HealthCheck;
  simulate: Simulate;

  constructor(opts: IConfigurationOpts) {
    const config = new Configuration(opts);

    // Resources
    this.accounts = new Account(config);
    this.elements = new Element(config);
    this.entities = new Entity(config);
    this.merchants = new Merchant(config);
    this.payments = new Payment(config);
    this.reports = new Report(config);
    this.webhooks = new Webhook(config);
    this.healthcheck = new HealthCheck(config);
    this.simulate = new Simulate(config);
  }

  public async ping(): Promise<IResponse<IPingResponse>> {
    return this.healthcheck.retrieve();
  }
};
