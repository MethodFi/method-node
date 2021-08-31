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

// Enums
import { Configurations } from './enums';

// Types
import type { TClientConfig, TClient } from './types';

export default function (opts: TClientConfig): TClient {
  const config = Configurations[opts.env] || Configurations.dev;
  const key = opts.key;

  const axios_instance = axios.create({
    baseURL: config.base_url,
    headers: { Authorization: `Bearer ${key}` },
  });

  // TODO: handle errors

  return {
    accounts: new Accounts({ axios_instance }),
    elements: new Elements({ axios_instance }),
    entities: new Entities({ axios_instance }),
    merchants: new Merchants({ axios_instance }),
    payments: new Payments({ axios_instance }),
    reports: new Reports({ axios_instance }),
    webhooks: new Webhooks({ axios_instance }),
  };
};
