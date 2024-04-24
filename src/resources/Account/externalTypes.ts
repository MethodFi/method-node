export interface IPlaidBalance {
  available : number | null;
  current : number | null;
  iso_currency_code : string | null;
  limit : number | null;
  unofficial_currency_code : string | null;
};

export interface IPlaidLocation {
  address: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  store_number: string | null;
};

export interface IPlaidPaymentMeta {
  reference_number: string | null;
  ppd_id: string | null;
  payee: string | null;
  by_order_of: string | null;
  payer: string | null;
  payment_method: string | null;
  payment_processor: string | null;
  reason: string | null;
}

export const PlaidTransactionTypes = {
  Digital: 'digital',
  Place: 'place',
  Special: 'special',
  Unresolved: 'unresolved',
};

export type TPlaidTransactionTypes = keyof typeof PlaidTransactionTypes;


export const PlaidTransactionPaymentChannelTypes = {
  online: 'online',
  in_store: 'in store',
  other: 'other',
} as const;

export type TPlaidTransactionPaymentChannelTypes = typeof PlaidTransactionPaymentChannelTypes[keyof typeof PlaidTransactionPaymentChannelTypes];

export const PlaidTransactionCode = {
  adjustment: 'adjustment',
  atm: 'atm',
  bank_charge: 'bank charge',
  bill_payment: 'bill payment',
  cash: 'cash',
  cashback: 'cashback',
  cheque: 'cheque',
  direct_debit: 'direct debit',
  interest: 'interest',
  purchase: 'purchase',
  standing_order: 'standing order',
  transfer: 'transfer',
  null: 'null',
} as const;

export type TPlaidTransactionCode = typeof PlaidTransactionCode[keyof typeof PlaidTransactionCode];

export const PlaidCounterpartyType = {
  merchant: 'merchant',
  financial_institution: 'financial_institution',
  payment_app: 'payment_app',
  marketplace: 'marketplace',
  payment_terminal: 'payment_terminal',
  income_source: 'income_source',
}

export type TPlaidCounterpartyType = keyof typeof PlaidCounterpartyType;

export interface IPlaidPersonalFinanceCategory {
  primary: string;
  detailed: string;
  confidence_level?: string | null;
};

export interface IPlaidTransactionCounterparty {
  name: string;
  entity_id?: string | null;
  type: TPlaidCounterpartyType;
  website: string | null;
  logo_url: string | null;
  confidence_level?: string | null;
};

export interface IPlaidTransaction {
  account_id: string;
  amount: number;
  iso_currency_code: string | null;
  unofficial_currency_code: string | null;
  category?: string[] | null;
  category_id?: string | null;
  check_number?: string | null;
  date: string;
  location: IPlaidLocation;
  name: string;
  merchant_name?: string | null;
  original_description?: string | null;
  payment_meta: IPlaidPaymentMeta;
  pending: boolean;
  pending_transaction_id: string | null;
  account_owner: string | null;
  transaction_id: string;
  transaction_type?: TPlaidTransactionTypes | null;
  logo_url?: string | null;
  website?: string | null;
  authorized_date: string | null;
  authorized_datetime: string | null;
  datetime: string | null;
  payment_channel: TPlaidTransactionPaymentChannelTypes;
  personal_finance_category?: IPlaidPersonalFinanceCategory | null;
  transaction_code: TPlaidTransactionCode | null;
  personal_finance_category_icon_url?: string;
  counterparties?: IPlaidTransactionCounterparty[];
  merchant_entity_id?: string | null;
};

export interface IMXAccount {
  account_number: string;
  account_ownership: string;
  annuity_policy_to_date: string;
  annuity_provider: string;
  annuity_term_year: number;
  apr: number;
  apy: number;
  available_balance: number;
  available_credit: number;
  balance: number;
  cash_balance: number;
  cash_surrender_value: number;
  created_at: string;
  credit_limit: number;
  currency_code: string;
  day_payment_is_due: number;
  death_benefit: number;
  guid: string;
  holdings_value: number;
  id: string;
  imported_at: string;
  interest_rate: number;
  institution_code: string;
  insured_name: string;
  is_closed: boolean;
  is_hidden: boolean;
  is_manual: boolean;
  last_payment: number;
  last_payment_at: string;
  loan_amount: number;
  margin_balance: number;
  matures_on: string;
  member_guid: string;
  member_id: string;
  member_is_managed_by_user: boolean;
  metadata: string;
  minimum_balance: number;
  minimum_payment: number;
  name: string;
  nickname: string;
  original_balance: number;
  pay_out_amount: number;
  payment_due_at: string;
  payoff_balance: number;
  premium_amount: number;
  property_type: string;
  routing_number: string;
  skip_webhook: boolean;
  started_on: string;
  subtype: string;
  today_ugl_amount: number;
  today_ugl_percentage: number;
  total_account_value: number;
  type: string;
  updated_at: string;
  user_guid: string;
  user_id: string;
};

export interface IMXTransaction {
  account_guid: string;
  account_id: string;
  amount: number;
  category: string;
  category_guid: string;
  check_number_string: string;
  created_at: string;
  currency_code: string;
  date: string;
  description: string;
  extended_transaction_type: string;
  guid: string;
  id: string;
  is_bill_pay: boolean;
  is_direct_deposit: boolean;
  is_expense: boolean;
  is_fee: boolean;
  is_income: boolean;
  is_international: boolean;
  is_overdraft_fee: boolean;
  is_payroll_advance: boolean;
  is_recurring: boolean;
  is_subscription: boolean;
  latitude: number;
  localized_description: string;
  localized_memo: string;
  longitude: number;
  member_guid: string;
  member_is_managed_by_user: boolean;
  memo: string;
  merchant_category_code: number;
  merchant_guid: string;
  merchant_location_guid: string;
  metadata: string;
  original_description: string;
  posted_at: string;
  status: string;
  top_level_category: string;
  transacted_at: string;
  type: string;
  updated_at: string;
  user_guid: string;
  user_id: string;
};

export interface ITellerLinks {
  account: string;
  self: string;
};

export interface ITellerBalance {
  ledger: number;
  links: ITellerLinks;
  account_id: string;
  available: number;
};

export interface ITellerTransactionCounterparty {
  type: string;
  name: string;
};

export interface ITellerTransactionDetails {
  category: string;
  counterparty: ITellerTransactionCounterparty;
  processing_status: string;
};

export interface ITellerTransaction {
  running_balance: number | null;
  details: ITellerTransactionDetails;
  description: string;
  account_id: string;
  date: string;
  id: string;
  links: ITellerLinks;
  amount: number;
  type: string;
  status: string;
};
