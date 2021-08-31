// @flow
import { Environments } from './enums';

import Accounts from '../lib/accounts';
import Elements from '../lib/elements';
import Entities from '../lib/entities';
import Merchants from '../lib/merchants';
import Payments from '../lib/payments';
import Reports from '../lib/reports';
import Webhooks from '../lib/webhooks';


export type TEnvironments = $Keys<typeof Environments>;

export type TClientConfig = {
  env: TEnvironments,
  key: string,
};

export type TClient = {
  accounts: Accounts,
  elements: Elements,
  entities: Entities,
  merchants: Merchants,
  payments: Payments,
  reports: Reports,
  webhooks: Webhooks,
};
