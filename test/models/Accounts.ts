import { baseKeys } from "./baseKeys";

export const accountCardKeys = [
  ...baseKeys,
  'account_id',
  'network',
  'issuer',
  'last4',
  'brands',
  'shared',
];

export const accountBalanceKeys = [
  ...baseKeys,
  'balance',
];

export const accountPayoffKeys = [
  ...baseKeys,
  'amount',
  'term',
  'per_diem_amount',
];

export const AccountSensitiveKeys = [
  ...baseKeys,
  'account_id',
  'number',
  'exp_month',
  'exp_year',
  'cvv',
  'billing_zip_code',
];