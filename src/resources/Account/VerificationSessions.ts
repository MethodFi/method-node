import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type {
  IAccountVerificationSession,
  IAccountVerificationSessionCreateOpts,
  IAccountVerificationSessionUpdateOpts,
} from './types';

export default class AccountVerificationSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  /**
   * Retrieve an AccountVerificationSession object by its ID.
   *
   * @param avf_id ID of the AccountVerificationSession object.
   * @returns AccountVerificationSession object.
   */

  async retrieve(avf_id: string) {
    return super._getWithId<IResponse<IAccountVerificationSession>>(avf_id);
  }

  /**
   * Creates an AccountVerificationSession of the provided type.
   *
   * @param data IAccountVerificationSessionCreateOpts: { type: TAccountVerificaionSessionTypes }
   * @returns AccountVerificationSession object.
   */

  async create(data: IAccountVerificationSessionCreateOpts) {
    return super._create<IResponse<IAccountVerificationSession>, IAccountVerificationSessionCreateOpts>(data);
  }
  // TODO: Add URL of docs page for this method.
  /**
   * Updates an existing AccountVerificationSession object
   *
   * @param avf_id ID of the AccountVerificationSession object.
   * @param data Update data for the AccountVerificationSession object based on it's type.
   * @returns AccountVerificationSession object.
   */

  async update(avf_id: string, data: IAccountVerificationSessionUpdateOpts) {
    return super._updateWithId<IResponse<IAccountVerificationSession>, IAccountVerificationSessionUpdateOpts>(avf_id, data);
  }
};
