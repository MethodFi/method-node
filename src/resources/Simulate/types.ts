export const ConnectBehaviors = {
  new_credit_card_account: 'new_credit_card_account',
  new_auto_loan_account: 'new_auto_loan_account',
  new_mortgage_account: 'new_mortgage_account',
  new_student_loan_account: 'new_student_loan_account',
  new_personal_loan_account: 'new_personal_loan_account',
} as const;

export type TConnectBehaviors =
  (typeof ConnectBehaviors)[keyof typeof ConnectBehaviors];

export type SimulateEntityConnectOpts = {
  behaviors: TConnectBehaviors[];
};

export const AttributesBehaviors = {
  new_soft_inquiry: 'new_soft_inquiry',
} as const;

export type TAttributesBehaviors =
  (typeof AttributesBehaviors)[keyof typeof AttributesBehaviors];

export type SimulateEntityAttributesOpts = {
  behaviors: TAttributesBehaviors[];
};
