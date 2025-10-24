export const WebhookTypes = {
  payment_create: 'payment.create',
  payment_update: 'payment.update',
  account_create: 'account.create',
  account_update: 'account.update',
  entity_update: 'entity.update',
  entity_create: 'entity.create',
  account_verification_create: 'account_verification.create',
  account_verification_update: 'account_verification.update',
  payment_reversal_create: 'payment_reversal.create',
  payment_reversal_update: 'payment_reversal.update',
  connection_create: 'connection.create',
  connection_update: 'connection.update',
  transaction_create: 'transaction.create',
  transaction_update: 'transaction.update',
  report_create: 'report.create',
  report_update: 'report.update',
  product_create: 'product.create',
  product_update: 'product.update',
  subscription_create: 'subscription.create',
  subscription_update: 'subscription.update',
  credit_score_create: 'credit_score.create',
  credit_score_update: 'credit_score.update',
  payoff_create: 'payoff.create',
  payoff_update: 'payoff.update',
  entity_verification_session_create: 'entity_verification_session.create',
  entity_verification_session_update: 'entity_verification_session.update',
  connect_create: 'connect.create',
  connect_update: 'connect.update',
  connect_available: 'connect.available',
  balance_create: 'balance.create',
  balance_update: 'balance.update',
  identity_create: 'identity.create',
  identity_update: 'identity.update',
  account_verification_session_create: 'account_verification_session.create',
  account_verification_session_update: 'account_verification_session.update',
  card_brand_create: 'card_brand.create',
  card_brand_update: 'card_brand.update',
  card_brand_available: 'card_brand.available',
  sensitive_create: 'sensitive.create',
  sensitive_update: 'sensitive.update',
  update_create: 'update.create',
  update_update: 'update.update',
  attribute_create: 'attribute.create',
  attribute_update: 'attribute.update',
  account_opened: 'account.opened',
  account_closed: 'account.closed',
  credit_score_increased: 'credit_score.increased',
  credit_score_decreased: 'credit_score.decreased',
  attribute_credit_health_credit_card_usage_increased: 'attribute.credit_health_credit_card_usage.increased',
  attribute_credit_health_credit_card_usage_decreased: 'attribute.credit_health_credit_card_usage.decreased',
  attribute_credit_health_derogatory_marks_increased: 'attribute.credit_health_derogatory_marks.increased',
  attribute_credit_health_derogatory_marks_decreased: 'attribute.credit_health_derogatory_marks.decreased',
  attribute_credit_health_hard_inquiries_increased: 'attribute.credit_health_hard_inquiries.increased',
  attribute_credit_health_hard_inquiries_decreased: 'attribute.credit_health_hard_inquiries.decreased',
  attribute_credit_health_total_accounts_increased: 'attribute.credit_health_total_accounts.increased',
  attribute_credit_health_total_accounts_decreased: 'attribute.credit_health_total_accounts.decreased',
  attribute_credit_health_credit_age_increased: 'attribute.credit_health_credit_age.increased',
  attribute_credit_health_credit_age_decreased: 'attribute.credit_health_credit_age.decreased',
  attribute_credit_health_payment_history_increased: 'attribute.credit_health_payment_history.increased',
  attribute_credit_health_payment_history_decreased: 'attribute.credit_health_payment_history.decreased',
  attribute_credit_health_open_accounts_increased: 'attribute.credit_health_open_accounts.increased',
  attribute_credit_health_open_accounts_decreased: 'attribute.credit_health_open_accounts.decreased',
} as const;

export type TWebhookTypes = typeof WebhookTypes[keyof typeof WebhookTypes];

export const WebhookStatus = {
  active: 'active',
  disabled: 'disabled',
  deleted: 'deleted',
  requires_attention: 'requires_attention',
} as const;

export type TWebhookStatus = typeof WebhookStatus[keyof typeof WebhookStatus];

export type TUpdateWebhookStatus = 'active' | 'disabled';

export interface IWebhook {
  id: string;
  type: TWebhookTypes;
  url: string;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
  expand_event: boolean;
  error: object | null;
  status: string | null;
};

export interface IWebhookCreateOpts {
  type: TWebhookTypes;
  url: string;
  auth_token?: string;
  hmac_secret?: string;
  metadata?: {};
  expand_event?: boolean;
};

export interface IWebhookUpdateOpts {
  status: TUpdateWebhookStatus;
};