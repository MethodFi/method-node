import Configuration, { IConfigurationOpts, IResponse } from './configuration';
import Account from './resources/Account';
import CardProduct from './resources/CardProduct';
import Element from './resources/Element';
import Entity from './resources/Entity';
import Event from './resources/Event';
import Merchant from './resources/Merchant';
import Payment from './resources/Payment';
import Report from './resources/Report';
import ReportSchedule from './resources/ReportSchedule';
import Webhook from './resources/Webhook';
import HealthCheck, { IPingResponse } from './resources/HealthCheck';
import Simulate from './resources/Simulate';
import Opal from './resources/Opal';
import ForwardingRequest from './resources/ForwardingRequest';
import Secret from './resources/Secret';
import Team from './resources/Team';
import { ManagedAccount } from './resources/ManagedAccount';

export class Method {
  accounts: Account;
  cardProducts: CardProduct;
  elements: Element;
  events: Event;
  entities: Entity;
  merchants: Merchant;
  payments: Payment;
  reports: Report;
  reportSchedules: ReportSchedule;
  webhooks: Webhook;
  healthcheck: HealthCheck;
  simulate: Simulate;
  opal: Opal;
  forwardingRequests: ForwardingRequest;
  secrets: Secret;
  teams: Team;
  managedAccounts: ManagedAccount;

  constructor(opts: IConfigurationOpts) {
    const config = new Configuration(opts);

    // Resources
    this.accounts = new Account(config);
    this.cardProducts = new CardProduct(config);
    this.elements = new Element(config);
    this.events = new Event(config);
    this.entities = new Entity(config);
    this.merchants = new Merchant(config);
    this.payments = new Payment(config);
    this.reports = new Report(config);
    this.reportSchedules = new ReportSchedule(config);
    this.webhooks = new Webhook(config);
    this.healthcheck = new HealthCheck(config);
    this.simulate = new Simulate(config);
    this.opal = new Opal(config);
    this.forwardingRequests = new ForwardingRequest(config);
    this.secrets = new Secret(config);
    this.teams = new Team(config);
    this.managedAccounts = new ManagedAccount(config);
  }

  public async ping(): Promise<IResponse<IPingResponse>> {
    return this.healthcheck.retrieve();
  }
};
