import Resource, { IRequestConfig } from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type { IEntityConnect } from './types';

export interface IManualConnectTradeline {
  type_code: string | null;
  portfolio_type_code: string | null;
  designator_code: string | null;
  number: string | null;
  creditor_name: string | null;
  creditor_code: string | null;
  balance: number | null;
  highest_balance: number | null;
  credit_limit: number | null;
  term: number | null;
  next_payment_minimum_amount: number | null;
  last_payment_amount: number | null;
  payment_history: string[] | null;
  past_due_amount: number | null;
  delinquency_charge_off_amount: number | null;
  opened_at: string | null;
  closed_at: string | null;
  last_activity_date: string | null;
  reported_date: string | null;
  next_payment_due_date: string | null;
  last_payment_date: string | null;
  delinquency_first_start_date: string | null;
  narrative_codes: { code: string | null; description: string | null; }[] | null;
  external_id?: string | null;
};

export interface IManualConnectCreateOpts {
  bureau: 'equifax' | 'transunion';
  tradelines: IManualConnectTradeline[];
};

export default class EntityManualConnect extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('manual_connect'));
  }

  async retrieve(mcxn_id: string) {
    return super._getWithId<IResponse<IEntityConnect>>(mcxn_id);
  }

  async create(opts: IManualConnectCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IResponse<IEntityConnect>, IManualConnectCreateOpts>(opts, undefined, requestConfig);
  }
};
