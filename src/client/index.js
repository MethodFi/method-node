// @flow
import axios from 'axios';

// Resources
import Accounts from '../lib/accounts';
import Elements from '../lib/elements';
import Entities from '../lib/entities';
import Merchants from '../lib/merchants';
import Payments from '../lib/payments';
import Reports from '../lib/reports';
import Webhooks from '../lib/webhooks';
import RoutingNumbers from '../lib/routing_numbers';
import BINs from '../lib/bins';

// Enums
import { Configurations, Environments } from './enums';

// Types
import type { TMethodClientConfig } from './types';


export default class MethodClient {
  accounts: Accounts;
  elements: Elements;
  entities: Entities;
  merchants: Merchants;
  payments: Payments;
  reports: Reports;
  webhooks: Webhooks;
  routingNumbers: RoutingNumbers;
  bins: BINs;

  constructor(opts: TMethodClientConfig) {
    const config = Configurations[opts.env || Environments.dev];
    const key = opts.key;
    const axios_instance = axios.create({ baseURL: config.base_url, headers: { Authorization: `Bearer ${key}` } });

    const response_interceptor = (res) => {
      if (res.headers['idem-status'] && res.data && res.data.data) {
        res.data.data.idempotency_status = res.headers['idem-status'];
      }
      return res;
    };

    axios_instance.interceptors.response.use(response_interceptor);

    this.accounts = new Accounts({ axios_instance });
    this.elements = new Elements({ axios_instance });
    this.entities = new Entities({ axios_instance });
    this.merchants = new Merchants({ axios_instance });
    this.payments = new Payments({ axios_instance });
    this.reports = new Reports({ axios_instance });
    this.webhooks = new Webhooks({ axios_instance });
    this.routingNumbers = new RoutingNumbers({ axios_instance });
    this.bins = new BINs({ axios_instance });
  }
}
