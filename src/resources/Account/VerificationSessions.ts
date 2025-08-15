import Resource, { IResourceListOpts } from '../../resource';
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
   * https://docs.methodfi.com/reference/accounts/verification-sessions/retrieve
   *
   * @param avf_id ID of the AccountVerificationSession object.
   * @returns AccountVerificationSession object.
   */

  async retrieve(avf_id: string) {
    return super._getWithId<IResponse<IAccountVerificationSession>>(avf_id);
  }

  /**
   * Retrieves a list of AccountVerificationSession objects for an account.
   * https://docs.methodfi.com/reference/accounts/verification-sessions/list
   *
   * @returns Returns a list of AccountVerificationSession objects.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IResponse<IAccountVerificationSession>>(opts);
  }

  /**
   * Creates an AccountVerificationSession of the provided type.
   * https://docs.methodfi.com/reference/accounts/verification-sessions/create
   *
   * @param data IAccountVerificationSessionCreateOpts: { type: TAccountVerificaionSessionTypes }
   * @returns AccountVerificationSession object.
   */

  async create(data: IAccountVerificationSessionCreateOpts) {
    return super._create<IResponse<IAccountVerificationSession>, IAccountVerificationSessionCreateOpts>(data);
  }

  /**
   * Updates an existing AccountVerificationSession object
   * https://docs.methodfi.com/reference/accounts/verification-sessions/overview
   *
   * @param avf_id ID of the AccountVerificationSession object.
   * @param data Update data for the AccountVerificationSession object based on it's type.
   * @returns AccountVerificationSession object.
   */

  async update(avf_id: string, data: IAccountVerificationSessionUpdateOpts) {
    return super._updateWithId<IResponse<IAccountVerificationSession>, IAccountVerificationSessionUpdateOpts>(avf_id, data);
  }
};
