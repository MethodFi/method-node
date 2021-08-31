// @flow
export const EntityIndividualTypes = {
  individual: 'individual',
};

export const EntityCorporationTypes = {
  c_corporation: 'c_corporation',
  s_corporation: 's_corporation',
  llc: 'llc',
  partnership: 'partnership',
  sole_proprietorship: 'sole_proprietorship',
};

export const EntityReceiveOnlyTypes = {
  receive_only: 'receive_only',
};

export const EntityCapabilities = {
  'payments:send': 'payments:send',
  'payments:receive': 'payments:receive',
  'payments:limited-send': 'payments:limited-send',
};

export const EntityStatuses = {
  active: 'active',
  incomplete: 'incomplete',
  pending: 'pending',
  blocked: 'blocked',
  error: 'error',
};
