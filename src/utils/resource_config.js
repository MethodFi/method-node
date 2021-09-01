// @flow
import object_hash from 'object-hash';
import type { TResourceCreationConfig } from '../common/types';

export default function get_idempotency_key(opts: Object, config: TResourceCreationConfig): string {
  return config.idempotency_key || object_hash(opts);
}
