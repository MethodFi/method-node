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

export interface IOpalIdentityVerificationCreateOpts {
  skip_pii: TSkipPII[];
}

export interface IOpalConnectCreateOpts {
  skip_pii: TSkipPII[];
  selection_type: 'single' | 'multiple' | 'all';
  allowed_account_types: 'credit_card' | 'auto_loan' | 'mortgage' | 'personal_loan' | 'student_loan';
}

export interface IOpalCardConnectCreateOpts {
  skip_pii: TSkipPII[];
  selection_type: 'single' | 'multiple' | 'all';
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