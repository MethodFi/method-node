const OpalModes = {
  identity_verification: 'identity_verification',
  connect: 'connect',
  card_connect: 'card_connect',
  account_verification: 'account_verification',
  transactions: 'transactions',
} as const;
export type TOpalModes = keyof typeof OpalModes;

const SkipPII = {
  name: 'name',
  dob: 'dob',
  address: 'address',
  ssn_4: 'ssn_4',
} as const;
export type TSkipPII = keyof typeof SkipPII;

const AccountFiltersAccountTypes = {
  credit_card: 'credit_card',
  auto_loan: 'auto_loan',
  mortgage: 'mortgage',
  personal_loan: 'personal_loan',
  student_loan: 'student_loan',
} as const;
export type TAccountFiltersAccountTypes = keyof typeof AccountFiltersAccountTypes;

export type TSelectionType = 'single' | 'multiple' | 'all';

export interface IOpalAccountFiltersInclude {
  account_types: TAccountFiltersAccountTypes[];
}

export interface IOpalAccountFiltersExclude {
  account_types: TAccountFiltersAccountTypes[];
  mch_ids: string[];
  unverified_account_numbers: boolean;
}

export interface IConnectAccountFilters {
  include: IOpalAccountFiltersInclude;
  exclude: IOpalAccountFiltersExclude;
}

export interface ICardConnectAccountFilters {
  exclude: Omit<IOpalAccountFiltersExclude, 'account_types'>; 
}

export interface IOpalIdentityVerificationCreateOpts {
  skip_pii: TSkipPII[];
}

export interface IOpalConnectCreateOpts {
  skip_pii: TSkipPII[];
  selection_type: TSelectionType;
  account_filters: IConnectAccountFilters;
}

export interface IOpalCardConnectCreateOpts {
  skip_pii: TSkipPII[];
  selection_type: TSelectionType;
  account_filters: ICardConnectAccountFilters;
}

export interface IOpalAccountVerificationCreateOpts {
  account_id: string;
}

export interface IOpalTransactionsCreateOpts {
  transactions: {};
}

export interface IOpalTokenCreateOpts {
  mode: TOpalModes;
  entity_id: string;
  identity_verification?: IOpalIdentityVerificationCreateOpts;
  connect?: IOpalConnectCreateOpts;
  card_connect?: IOpalCardConnectCreateOpts;
  account_verification?: IOpalAccountVerificationCreateOpts;
  transactions?: IOpalTransactionsCreateOpts;
}

export interface IOpalToken {
  token: string;
  valid_until: string;
  session_id: string;
}